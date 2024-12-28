import { generateGamePrompt } from './aws/bedrock';
import type { GamePrompt } from '../types';

export class PromptService {
  async generateStoryPrompt(theme: string, difficulty: string): Promise<GamePrompt> {
    try {
      const response = await generateGamePrompt({
        gameType: 'bible-charades',
        difficulty,
        theme
      });

      // Parse and validate the Bedrock response
      const prompt = JSON.parse(response.body);
      
      return {
        title: prompt.title,
        description: prompt.description,
        scripture: prompt.scripture,
        options: prompt.options,
        devotional: prompt.devotional,
        imagePrompt: prompt.imagePrompt
      };
    } catch (error) {
      console.error('Error generating story prompt:', error);
      throw new Error('Failed to generate game prompt');
    }
  }
}

export const promptService = new PromptService();