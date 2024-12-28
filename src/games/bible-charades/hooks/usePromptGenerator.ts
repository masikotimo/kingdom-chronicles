import { useState, useCallback } from 'react';
import { promptService } from '../services/promptService';
import type { GamePrompt } from '../types';

export const usePromptGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePrompt = useCallback(async (theme: string, difficulty: string): Promise<GamePrompt | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = await promptService.generateStoryPrompt(theme, difficulty);
      return prompt;
    } catch (err) {
      setError('Failed to generate game prompt');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generatePrompt,
    isLoading,
    error
  };
};