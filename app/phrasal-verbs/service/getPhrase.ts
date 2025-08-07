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
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/phrase/allphrases`;
    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    
    const res = await fetch(url, {
      next: { tags: ['phrasal-verbs'] } // Optional: for Next.js caching
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch phrases: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Validate the response structure
    if (!data.data || !data.pagination) {
      throw new Error('Invalid API response structure');
    }

    return data as PaginatedResponse;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};