import { useState, useCallback, useEffect } from 'react';
import { usePromptGenerator } from './usePromptGenerator';
import type { GameState, Team, GameSettings, BibleStory } from '../types';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentStory: null,
    teams: [],
    settings: {
      totalRounds: 5,
      timePerRound: 60,
      points: { correct: 100, timeBonus: 10 }
    },
    currentRound: 0,
    timeLeft: 60,
    isPlaying: false,
    roundScore: 0,
    questionsAnswered: 0
  });

  const { generatePrompt, isLoading } = usePromptGenerator();

  const getNextStory = useCallback(async (theme: string = 'general'): Promise<BibleStory | null> => {
    const difficulty = gameState.currentRound <= 2 ? 'easy' : 
                      gameState.currentRound <= 4 ? 'medium' : 'hard';
    
    try {
      const prompt = await generatePrompt(theme, difficulty);
      if (!prompt) return null;

      return {
        ...prompt,
        id: `story-${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1920&auto=format&fit=crop'
      };
    } catch (error) {
      console.error('Error generating story:', error);
      return null;
    }
  }, [gameState.currentRound, generatePrompt]);

  const startGame = useCallback(async (teams: Team[], settings: GameSettings) => {
    const firstStory = await getNextStory();
    if (!firstStory) return;

    setGameState({
      teams,
      settings,
      currentRound: 1,
      timeLeft: settings.timePerRound,
      isPlaying: true,
      currentStory: firstStory,
      roundScore: 0,
      questionsAnswered: 0
    });
  }, [getNextStory]);

  const makeGuess = useCallback(async (guess: string) => {
    if (!gameState.currentStory) return;

    const isCorrect = guess === gameState.currentStory.title;
    if (isCorrect) {
      const timeBonus = Math.floor(gameState.timeLeft * 0.5);
      const newScore = gameState.roundScore + 100 + timeBonus;
      
      const nextStory = await getNextStory();
      
      setGameState(prev => ({
        ...prev,
        currentStory: nextStory,
        roundScore: newScore,
        questionsAnswered: prev.questionsAnswered + 1
      }));
    }
  }, [gameState.currentStory, gameState.timeLeft, gameState.roundScore, getNextStory]);

  const nextRound = useCallback(async () => {
    if (gameState.currentRound >= gameState.settings.totalRounds) {
      setGameState(prev => ({
        ...prev,
        isPlaying: false
      }));
      return;
    }

    const updatedTeams = gameState.teams.map(team => ({
      ...team,
      score: team.isActing ? team.score + gameState.roundScore : team.score,
      isActing: !team.isActing
    }));

    const nextStory = await getNextStory();
    
    setGameState(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      timeLeft: prev.settings.timePerRound,
      currentStory: nextStory,
      teams: updatedTeams,
      roundScore: 0,
      questionsAnswered: 0
    }));
  }, [gameState.currentRound, gameState.settings.totalRounds, gameState.teams, gameState.roundScore, getNextStory]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft]);

  return {
    gameState,
    startGame,
    makeGuess,
    nextRound,
    isLoading
  };
};