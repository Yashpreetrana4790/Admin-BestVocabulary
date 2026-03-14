// Service for searching words to add as synonyms
import { WordData } from '@/types/word';

export interface WordSearchResult {
  _id: string;
  word: string;
  pronunciation?: string;
  meanings?: Array<{
    meaning?: string;
    pos?: string;
    subtitle?: string;
    category?: string;
    difficulty?: string;
    example_sentences?: string[];
  }>;
  frequency?: string;
  // Include other WordData fields as optional
  overall_tone?: string;
  etymology?: string;
  misspellings?: string[];
  note?: string;
}

export const searchWords = async (query: string, limit: number = 20): Promise<WordSearchResult[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/words/words?search=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`Failed to search words: ${res.statusText}`);
    }

    const data = await res.json();

    // Handle different response structures (same as getWords service)
    let words: WordSearchResult[] = [];
    if (Array.isArray(data)) {
      words = data;
    } else if (data.words && Array.isArray(data.words)) {
      words = data.words;
    } else if (data.data && Array.isArray(data.data)) {
      words = data.data;
    }

    return words;
  } catch (error) {
    console.error("Word search failed:", error);
    return [];
  }
};

