export const getAllQuestions = async (page: number, limit: number) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
      );
    }

    const url = new URL(`${apiUrl}/questions/allquestions`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    
    let res: Response;
    try {
      res = await fetch(url.toString(), {
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (fetchError) {
      // Handle network errors (server not running, connection refused, etc.)
      console.error('[getAllQuestions] Network error:', fetchError);
      if (fetchError instanceof Error) {
        if (fetchError.message.includes('fetch failed') || fetchError.message.includes('ECONNREFUSED')) {
          throw new Error(
            `Cannot connect to backend server at ${apiUrl}. Please ensure:\n` +
            `1. Backend server is running on port 8000\n` +
            `2. NEXT_PUBLIC_API_URL is set correctly in .env.local\n` +
            `3. No firewall is blocking the connection`
          );
        }
      }
      throw fetchError;
    }
    
    if (!res.ok) {
      let errorText = '';
      try {
        errorText = await res.text();
      } catch (e) {
        errorText = 'Could not read error response';
      }
      console.error('[getAllQuestions] API Error:', {
        status: res.status,
        statusText: res.statusText,
        url: url.toString(),
        errorText
      });
      throw new Error(`Failed to fetch questions: ${res.status} ${res.statusText}. ${errorText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[getAllQuestions] Fetch failed:', error);
    if (error instanceof Error) {
      console.error('[getAllQuestions] Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    throw error; // Re-throw to let the calling component handle it
  }
};
