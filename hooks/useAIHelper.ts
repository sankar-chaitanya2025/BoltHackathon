import { useState, useCallback } from 'react';
import OpenAI from 'openai';

interface Suggestions {
  topics: string[];
  keyPoints: string[];
}

const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',  // Ollama API endpoint
  apiKey: 'dummy',  // Ollama doesn't require an API key
});

export function useAIHelper() {
  const [suggestions, setSuggestions] = useState<Suggestions>({
    topics: [],
    keyPoints: [],
  });

  const analyzeMeeting = useCallback(async (transcript: string) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'mistral',  // Using Mistral model from Ollama
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant analyzing meeting transcripts. Provide structured output in JSON format with topics and key points.',
          },
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

      const content = response.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        setSuggestions({
          topics: parsed.topics || [],
          keyPoints: parsed.keyPoints || [],
        });
      }
    } catch (error) {
      console.error('Error analyzing meeting:', error);
      // Fallback to mock suggestions if AI service is unavailable
      setSuggestions({
        topics: ['Continue current discussion', 'Review action items', 'Plan next steps'],
        keyPoints: ['Meeting in progress', 'Participants are engaged', 'Discussion ongoing'],
      });
    }
  }, []);

  return {
    suggestions,
    analyzeMeeting,
  };
}