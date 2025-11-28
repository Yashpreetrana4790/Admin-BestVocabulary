interface CreateWordProps {
  word: string;
  pronunciation: string;
  frequency: string;
  overall_tone?: string;
  etymology?: string;
  misspellings?: string[];
  meanings?: any[];
}

export const createWord = async (wordData: CreateWordProps) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
      );
    }

    const url = `${apiUrl}/words/word`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wordData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `Failed to create word: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error creating word:", error);
    throw error;
  }
};

