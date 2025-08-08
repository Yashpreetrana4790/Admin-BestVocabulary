

export const getAllQuestions = async (page: number, limit: number) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/questions/allquestions`);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  
  try {
    const res = await fetch(url.toString()); // fixed typo
    console.log(res, "rrrr")
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return []; // or handle differently based on your needs
  }
};
