export type StoryGenerationMode = 'chatgpt' | 'static' | 'bedrock';
export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface StoryImage {
  url: string;
  alt: string;
}

export interface BibleStory {
  id: string;
  title: string;
  description: string;
  scripture: string;
  difficulty: string;
  images: StoryImage[];
  fallbackDescription: string;
  options: string[];
  correctAnswer: string;  // Added to store the correct answer
  devotional: string;
}

export interface GameSettings {
  totalRounds: number;
  timePerRound: number;
  storyMode: StoryGenerationMode;
  difficulty: GameDifficulty;
  points: {
    correct: number;
    timeBonus: number;
  }
}

export interface GameState {
  currentStory: BibleStory | null;
  teams: Team[];
  settings: GameSettings;
  currentRound: number;
  timeLeft: number;
  isPlaying: boolean;
  roundScore: number;
  questionsAnswered: number;
  isLoading: boolean;
}

export interface Team {
  id: string;
  name: string;
  score: number;
  isActing: boolean;
}