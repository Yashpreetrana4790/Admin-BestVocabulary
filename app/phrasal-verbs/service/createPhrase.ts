interface PhrasalVerb {
  phrase: string;
  meaning: string;
  example_sentences: string[];
  synonyms: string[];
  antonyms: string[];
  relatedWords: string[];
}

export const CreateNewphrase = async (values: PhrasalVerb) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/phrase/createphrase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) throw new Error("Failed to create phrasal verb");

    return response.json();
  } catch (error) {
    console.error("Error creating phrasal verb:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};