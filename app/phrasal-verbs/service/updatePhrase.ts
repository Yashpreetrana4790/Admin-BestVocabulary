export const updatePhrase = async (id: string, data: any): Promise<any> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/phrase/phrase/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to update phrase: ${res.statusText}`);
    }

    const updatedData = await res.json();
    return updatedData;
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
};


export const deletePhrase = async (id: string): Promise<void> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/phrase/phrase/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Failed to delete phrase: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};
