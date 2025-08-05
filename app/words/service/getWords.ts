// service/getWords.ts

type GetWordsParams = {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  length?: number;
  startsWith?: string;
};

export const getWords = async (params: GetWordsParams = {}) => {
  try {
    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);
    if (params.difficulty) query.append("difficulty", params.difficulty);
    if (params.length) query.append("length", params.length.toString());
    if (params.startsWith) query.append("startsWith", params.startsWith);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/words/words?${query.toString()}`;
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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/words/words/${word}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch word: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};



