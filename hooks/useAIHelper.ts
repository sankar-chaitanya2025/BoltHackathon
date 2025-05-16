import { useState, useCallback } from 'react';
import Anthropic from '@anthropic-ai/sdk';

interface Suggestions {
  topics: string[];
  keyPoints: string[];
}

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

export function useAIHelper() {
  const [suggestions, setSuggestions] = useState<Suggestions>({
    topics: [],
    keyPoints: [],
  });

  const analyzeMeeting = useCallback(async (transcript: string) => {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Analyze this meeting transcript and provide:
              1. 3 relevant topics to discuss next
              2. 3 key points from the conversation
              
              Transcript:
              ${transcript}`,
          },
        ],
      });

      const response = message.content[0].text;
      const parsed = JSON.parse(response);

      setSuggestions({
        topics: parsed.topics || [],
        keyPoints: parsed.keyPoints || [],
      });
    } catch (error) {
      console.error('Error analyzing meeting:', error);
    }
  }, []);

  return {
    suggestions,
    analyzeMeeting,
  };
}