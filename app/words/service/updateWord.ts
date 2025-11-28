

interface WordFormProps {
  wordId: string;
  word: string;
  pronunciation: string;
  frequency: string;
  overall_tone: string;
  etymology: string;
  misspellings: string[]


}



export const updateBaseWordInfo = async ({ wordId, word, pronunciation, frequency, overall_tone, etymology, misspellings }: WordFormProps) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/words/word/${wordId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word, pronunciation, frequency, overall_tone, etymology, misspellings }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update word: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};


interface Meaning {
  pos: string;
  subtitle: string;
  pronunciation: string;
  common_usage: {
    context: string;
    example: string;
  }[];
  tone: string;
  category: string;
  difficulty: string;
  meaning: string;
  mnemonic: string;
  easyMeaning: string;
  kiddefinition: string;
  example_sentences: string[];
  synonyms: string[];
  antonyms: string[];
}

export const updateWordMeaningInfo = async (wordId: string, meanings: Meaning[]) => {
  try {
    console.log(meanings, "mng")
    const url = `${process.env.NEXT_PUBLIC_API_URL}/words/words/${wordId}/meanings`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ meanings }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update word meaning: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};