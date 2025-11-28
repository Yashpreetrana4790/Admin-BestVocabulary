interface PaginatedResponse {
  data: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getAllphrases = async (queryParams?: string): Promise<PaginatedResponse> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
      );
    }

    const baseUrl = `${apiUrl}/phrase/allphrases`;
    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    
    let res: Response;
    try {
      res = await fetch(url, {
        next: { revalidate: 60 }, // Cache for 60 seconds
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (fetchError) {
      // Handle network errors (server not running, connection refused, etc.)
      console.error('[getAllphrases] Network error:', fetchError);
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
      console.error('[getAllphrases] API Error:', {
        status: res.status,
        statusText: res.statusText,
        url,
        errorText
      });
      throw new Error(`Failed to fetch phrases: ${res.status} ${res.statusText}. ${errorText}`);
    }

    const data = await res.json();
    console.log('[getAllphrases] Response received:', { 
      hasData: !!data.data, 
      dataLength: data.data?.length,
      hasPagination: !!data.pagination 
    });
    
    // Validate the response structure
    if (!data) {
      console.error('[getAllphrases] No data in response');
      throw new Error('Invalid API response: No data received');
    }

    if (!data.data) {
      console.error('[getAllphrases] Missing data field:', data);
      throw new Error('Invalid API response: Missing data field');
    }

    if (!data.pagination) {
      console.error('[getAllphrases] Missing pagination field:', data);
      throw new Error('Invalid API response: Missing pagination field');
    }

    return {
      data: data.data,
      pagination: data.pagination
    } as PaginatedResponse;
  } catch (error) {
    console.error("[getAllphrases] Fetch failed:", error);
    if (error instanceof Error) {
      console.error("[getAllphrases] Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
};


export const getPhraseById = async (id: string): Promise<any> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
      );
    }

    if (!id) {
      throw new Error('Phrase ID is required');
    }

    const url = `${apiUrl}/phrase/phrase/${id}`;
    
    let res: Response;
    try {
      res = await fetch(url, {
        next: { revalidate: 60 }, // Cache for 60 seconds
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (fetchError) {
      // Handle network errors (server not running, connection refused, etc.)
      console.error('[getPhraseById] Network error:', fetchError);
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
      console.error('[getPhraseById] API Error:', {
        status: res.status,
        statusText: res.statusText,
        url,
        errorText
      });
      throw new Error(`Failed to fetch phrase: ${res.status} ${res.statusText}. ${errorText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("[getPhraseById] Fetch failed:", error);
    if (error instanceof Error) {
      console.error("[getPhraseById] Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  } 
};
