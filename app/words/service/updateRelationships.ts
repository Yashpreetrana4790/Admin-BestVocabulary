interface UpdateRelationshipsParams {
  wordId: string;
  meaningId: string;
  synonyms: string[];
  antonyms: string[];
}

export const updateWordRelationships = async ({
  wordId,
  meaningId,
  synonyms,
  antonyms
}: UpdateRelationshipsParams) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
      );
    }

    const url = `${apiUrl}/words/words/${wordId}/meanings/${meaningId}/relationships`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ synonyms, antonyms }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update relationships: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Update relationships failed:', error);
    throw error;
  }
};

