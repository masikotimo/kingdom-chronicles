import React, { useEffect, useCallback } from 'react';
import { Book } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import { useRoundManager } from '../shared/hooks/useRoundManager';
import { useGameScore } from '../../hooks/useGameScore';
import { RoundTimer } from '../../components/game/RoundTimer';
import { GameSetup } from './components/GameSetup';
import { BookDisplay } from './components/BookDisplay';
import { TestamentSelector } from './components/TestamentSelector';
import type { GameSettings, Testament } from './types';
import { analyticsService } from '../../services/analytics/analyticsService';

export const TestamentQuiz: React.FC = () => {
  const {
    currentBook,
    makeGuess,
    calculateScore,
    resetGame,
    correctAnswers,
    wrongAnswers,
    lastGuessCorrect
  } = useGameState();

  const {
    currentRound,
    timeLeft,
    isPlaying,
    settings,
    startGame,
    endRound,
    decrementTime,
    getTotalScore
  } = useRoundManager();

  const { handleScoreUpdate } = useGameScore('testament-quiz');

  const handleRoundEnd = useCallback(() => {
    const score = calculateScore(timeLeft);
    const duration = settings?.timePerRound ? settings.timePerRound - timeLeft : 0;
    analyticsService.trackGameEnd('testament-quiz', score.points, duration);
    
    handleScoreUpdate(score.points);
    endRound(score);
    resetGame();
  }, [calculateScore, handleScoreUpdate, endRound, resetGame, settings?.timePerRound, timeLeft]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setInterval(decrementTime, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, decrementTime]);

  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      handleRoundEnd();
    }
  }, [isPlaying, timeLeft, handleRoundEnd]);

  const handleGameStart = useCallback((gameSettings: GameSettings) => {
    analyticsService.trackGameStart('testament-quiz', gameSettings);
    resetGame();
    startGame(gameSettings);
  }, [resetGame, startGame]);

  if (!isPlaying || !settings) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Guess the Testament</h1>
          <p className="text-gray-600">Test your knowledge of Bible books!</p>
        </div>
        <GameSetup onGameStart={handleGameStart} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Round {currentRound} of {settings.totalRounds}</h2>
        <RoundTimer timeLeft={timeLeft} />
        <div className="mt-2">
          <span className="font-semibold">Correct: </span>
          <span className="text-green-600">{correctAnswers}</span>
          <span className="mx-2">|</span>
          <span className="font-semibold">Wrong: </span>
          <span className="text-red-600">{wrongAnswers}</span>
          <span className="mx-2">|</span>
          <span className="font-semibold">Score: </span>
          <span className="text-indigo-600">{getTotalScore()}</span>
        </div>
      </div>

      <BookDisplay book={currentBook} />
      
      <TestamentSelector
        onSelect={makeGuess}
        lastGuessCorrect={lastGuessCorrect}
        disabled={timeLeft === 0}
      />
    </div>
  );
};