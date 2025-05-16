import { useState, useCallback } from 'react';
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const tfidf = new natural.TfIdf();

export function useInterestAnalysis() {
  const [interests, setInterests] = useState<Map<string, string[]>>(new Map());

  const analyzeMessages = useCallback((messages: { content: string; user_id: string }[]) => {
    // Reset TF-IDF
    tfidf.documents = [];

    // Add each message as a document
    messages.forEach(message => {
      tfidf.addDocument(message.content);
    });

    // Extract keywords and associate them with users
    const userInterests = new Map<string, string[]>();

    messages.forEach((message, index) => {
      const terms = tfidf.listTerms(index);
      const keywords = terms
        .filter(term => term.tfidf > 0.5) // Adjust threshold as needed
        .map(term => term.term)
        .filter(term => term.length > 3); // Filter out short words

      const userId = message.user_id;
      const existingInterests = userInterests.get(userId) || [];
      userInterests.set(userId, [...new Set([...existingInterests, ...keywords])]);
    });

    // Group users by shared interests
    const interestGroups = new Map<string, string[]>();
    
    userInterests.forEach((interests, userId) => {
      interests.forEach(interest => {
        const users = interestGroups.get(interest) || [];
        interestGroups.set(interest, [...new Set([...users, userId])]);
      });
    });

    setInterests(interestGroups);
    return interestGroups;
  }, []);

  return {
    interests,
    analyzeMessages,
  };
}