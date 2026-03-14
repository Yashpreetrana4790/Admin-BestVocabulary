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

export const getAllIdioms = async (queryParams?: string): Promise<PaginatedResponse> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
      );
    }

    const baseUrl = `${apiUrl}/idioms/allidioms`;
    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    
    let res: Response;
    try {
      res = await fetch(url, {
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (fetchError) {
      console.error('[getAllIdioms] Network error:', fetchError);
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
      console.error('[getAllIdioms] API Error:', {
        status: res.status,
        statusText: res.statusText,
        url,
        errorText
      });
      throw new Error(`Failed to fetch idioms: ${res.status} ${res.statusText}. ${errorText}`);
    }

    const data = await res.json();
    
    if (!data || !data.data || !data.pagination) {
      throw new Error('Invalid API response structure');
    }

    return {
      data: data.data,
      pagination: data.pagination
    } as PaginatedResponse;
  } catch (error) {
    console.error("[getAllIdioms] Fetch failed:", error);
    throw error;
  }
};

export const getIdiomById = async (id: string): Promise<any> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
      );
    }

    if (!id) {
      throw new Error('Idiom ID is required');
    }

    const url = `${apiUrl}/idioms/idiom/${id}`;
    
    let res: Response;
    try {
      res = await fetch(url, {
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (fetchError) {
      console.error('[getIdiomById] Network error:', fetchError);
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
      console.error('[getIdiomById] API Error:', {
        status: res.status,
        statusText: res.statusText,
        url,
        errorText
      });
      throw new Error(`Failed to fetch idiom: ${res.status} ${res.statusText}. ${errorText}`);
    }

    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error("[getIdiomById] Fetch failed:", error);
    throw error;
  } 
};

export const createIdiom = async (idiomData: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/idioms/createidiom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(idiomData)
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to create idiom' }));
    throw new Error(error.error || error.message || 'Failed to create idiom');
  }
  return res.json();
};

export const updateIdiom = async (id: string, idiomData: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/idioms/idiom/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(idiomData)
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to update idiom' }));
    throw new Error(error.error || error.message || 'Failed to update idiom');
  }
  return res.json();
};

export const deleteIdiom = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/idioms/idiom/${id}`, {
    method: 'DELETE'
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to delete idiom' }));
    throw new Error(error.error || error.message || 'Failed to delete idiom');
  }
  return res.json();
};

