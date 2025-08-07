
interface PhrasalVerb {
  phrase: string;
  meaning: string;
  example_sentences: string[];
  synonyms: string[];
  antonyms: string[];
  relatedWords: string[];
}


export const updatePhrasalVerb = async (wordId: string, phrasalVerb: PhrasalVerb) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/words/words/${wordId}/phrasalVerbs`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phrasalVerb }),
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