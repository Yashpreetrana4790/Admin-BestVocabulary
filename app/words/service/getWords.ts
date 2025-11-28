// service/getWords.ts

type GetWordsParams = {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  length?: number | string;
  startsWith?: string;
  exactLetters?: number | string;
  minLetters?: number | string;
  maxLetters?: number | string;
  onlyAlphabets?: boolean | string;
  minMeanings?: number | string;
};

export const getWords = async (params: GetWordsParams = {}) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
      );
    }

    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);
    if (params.difficulty) query.append("difficulty", params.difficulty);
    if (params.length) query.append("length", params.length.toString());
    if (params.startsWith) query.append("startsWith", params.startsWith);
    if (params.exactLetters) query.append("exactLetters", params.exactLetters.toString());
    if (params.minLetters) query.append("minLetters", params.minLetters.toString());
    if (params.maxLetters) query.append("maxLetters", params.maxLetters.toString());
    if (params.onlyAlphabets) query.append("onlyAlphabets", params.onlyAlphabets.toString());
    if (params.minMeanings) query.append("minMeanings", params.minMeanings.toString());

    const url = `${apiUrl}/words/words?${query.toString()}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error(`Failed to fetch words: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};



export const getWord = async (word: string) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
      );
    }

    if (!word) {
      throw new Error('Word parameter is required');
    }

    // URL encode the word to handle special characters and spaces
    const encodedWord = encodeURIComponent(word);
    const url = `${apiUrl}/words/words/${encodedWord}`;
    
    console.log('[getWord] Fetching word:', { word, encodedWord, url });
    
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      console.error('[getWord] API Error:', {
        status: res.status,
        statusText: res.statusText,
        url,
        errorText
      });
      throw new Error(`Failed to fetch word: ${res.status === 404 ? 'Word not found' : res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("[getWord] Fetch failed:", error);
    throw error;
  }
};



