import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

interface GamePromptRequest {
  gameType: string;
  difficulty: string;
  theme: string;
}

const client = new BedrockRuntimeClient({ 
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

export async function generateGamePrompt(request: GamePromptRequest) {
  const prompt = `Generate a Bible-themed game prompt for ${request.gameType} with difficulty ${request.difficulty} focusing on ${request.theme}.
  
  The response should be a JSON object with the following structure:
  {
    "title": "Story title",
    "description": "Brief story description",
    "scripture": "Bible reference",
    "options": ["Correct answer", "Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
    "devotional": "Brief devotional message",
    "imagePrompt": "Description for image generation"
  }
  
  Make sure the content is engaging, accurate to Scripture, and appropriate for the difficulty level.`;

  const payload = {
    prompt,
    maxTokens: 500,
    temperature: 0.7,
    topP: 0.9,
  };

  try {
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-v2",
      body: JSON.stringify(payload),
      contentType: "application/json",
    });

    const response = await client.send(command);
    return JSON.parse(new TextDecoder().decode(response.body));
  } catch (error) {
    console.error('Error invoking Bedrock:', error);
    throw error;
  }
}