// service/getWords.ts

type GetWordsParams = {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  length?: number;
  startsWith?: string;
};

export const getWords = async (params: GetWordsParams = {}) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL environment variable is not set');
      // Return empty results if API URL is not set
      return {
        words: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: params.limit || 12,
        }
      };
    }

    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);
    if (params.difficulty) query.append("difficulty", params.difficulty);
    if (params.length) query.append("length", params.length.toString());
    if (params.startsWith) query.append("startsWith", params.startsWith);

    const url = `${apiUrl}/words/words?${query.toString()}`;
    console.log('🌐 Fetching from URL:', url);

    const res = await fetch(url, { next: { revalidate: 60 } });

    console.log('📡 Response status:', res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`Failed to fetch words: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // ALWAYS log the FULL response to see exactly what we get
    console.log('📦 FULL API Response:', JSON.stringify(data, null, 2));
    console.log('🔍 Response Analysis:', {
      type: typeof data,
      isArray: Array.isArray(data),
      keys: typeof data === 'object' && data !== null ? Object.keys(data) : 'N/A',
      hasWords: !!(data?.words),
      wordsIsArray: Array.isArray(data?.words),
      wordsLength: data?.words?.length,
      hasData: !!(data?.data),
      dataIsArray: Array.isArray(data?.data),
      dataLength: data?.data?.length,
      hasResult: !!(data as Record<string, unknown>)?.result,
      hasContent: !!(data as Record<string, unknown>)?.content,
      hasItems: !!(data as Record<string, unknown>)?.items,
      hasResults: !!(data as Record<string, unknown>)?.results,
    });

    // Special handling: Check if API wrapped response in success/data pattern
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const dataObj = data as Record<string, unknown>;
      // Handle { success: true, data: { words: [...] } } pattern
      if (dataObj.success && dataObj.data && typeof dataObj.data === 'object' && !Array.isArray(dataObj.data)) {
        console.log('🔍 Detected success/data wrapper pattern');
        const innerData = dataObj.data as Record<string, unknown>;
        if (Array.isArray(innerData.words)) {
          console.log('✅ Found words in success.data.words:', innerData.words.length);
          return {
            words: innerData.words as unknown[],
            pagination: innerData.pagination as typeof data.pagination || {
              currentPage: params.page || 1,
              totalPages: 0,
              totalItems: (innerData.words as unknown[]).length,
              itemsPerPage: params.limit || 12,
            }
          };
        }
        if (Array.isArray(innerData.data)) {
          console.log('✅ Found words in success.data.data:', innerData.data.length);
          return {
            words: innerData.data as unknown[],
            pagination: innerData.pagination as typeof data.pagination || {
              currentPage: params.page || 1,
              totalPages: 0,
              totalItems: (innerData.data as unknown[]).length,
              itemsPerPage: params.limit || 12,
            }
          };
        }
      }
    }

    // Normalize the response to always have 'words' property
    // This ensures consistency regardless of API response format
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Priority 1: If API returns { data: [...] }, convert to { words: [...] }
      // (This matches phrasal verbs API structure)
      if (Array.isArray(data.data)) {
        const normalized = {
          words: data.data,
          pagination: data.pagination || {
            currentPage: params.page || 1,
            totalPages: 0,
            totalItems: data.data.length,
            itemsPerPage: params.limit || 12,
          }
        };
        console.log('🔄 Converted data.data to words:', normalized.words.length, 'words');
        return normalized;
      }

      // Priority 2: If API returns { words: [...] }, use as-is
      if (Array.isArray(data.words)) {
        console.log('✅ API returned words directly:', data.words.length, 'words');
        return data;
      }
    }

    // If response is just an array directly
    if (Array.isArray(data)) {
      console.log('🔄 Converting array response to { words, pagination }:', data.length, 'words');
      return {
        words: data,
        pagination: {
          currentPage: params.page || 1,
          totalPages: Math.ceil(data.length / (params.limit || 12)),
          totalItems: data.length,
          itemsPerPage: params.limit || 12,
        }
      };
    }

    // Helper function to recursively search for word arrays in nested objects
    const findWordsArray = (obj: unknown, depth = 0, maxDepth = 5): unknown[] | null => {
      if (depth > maxDepth) return null;
      if (!obj || typeof obj !== 'object') return null;

      if (Array.isArray(obj)) {
        // Check if this array contains word-like objects
        if (obj.length > 0) {
          const firstItem = obj[0];
          if (firstItem && typeof firstItem === 'object' &&
            (firstItem.word || firstItem.term || firstItem._id ||
              (firstItem as Record<string, unknown>).phrase)) {
            return obj;
          }
        }
        return null;
      }

      // Check all properties recursively
      for (const key of Object.keys(obj as Record<string, unknown>)) {
        const value = (obj as Record<string, unknown>)[key];

        // Check common wrapper patterns first
        if (key === 'data' || key === 'words' || key === 'results' || key === 'items' || key === 'content') {
          if (Array.isArray(value) && value.length > 0) {
            const firstItem = value[0];
            if (firstItem && typeof firstItem === 'object' &&
              (firstItem.word || firstItem.term || firstItem._id ||
                (firstItem as Record<string, unknown>).phrase)) {
              console.log(`✅ Found words array in "${key}":`, value.length, 'items');
              return value as unknown[];
            }
          }
          // If value is an object, search deeper
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const nested = findWordsArray(value, depth + 1, maxDepth);
            if (nested) return nested;
          }
        }

        // Recursively search other properties too
        if (value && typeof value === 'object') {
          const nested = findWordsArray(value, depth + 1, maxDepth);
          if (nested) return nested;
        }
      }

      return null;
    };

    // Try to find ANY array property that might contain words (including nested)
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      console.log('🔍 Searching for array in nested properties (recursively)...');

      // First pass: check top-level arrays
      for (const key of Object.keys(data)) {
        const value = (data as Record<string, unknown>)[key];
        if (Array.isArray(value) && value.length > 0) {
          console.log(`🔍 Found array in "${key}":`, value.length, 'items');
          const firstItem = value[0];
          if (firstItem && typeof firstItem === 'object' &&
            (firstItem.word || firstItem.term || firstItem._id ||
              (firstItem as Record<string, unknown>).phrase)) {
            console.log(`✅ "${key}" appears to contain words!`);
            return {
              words: value as unknown[],
              pagination: (data as { pagination?: unknown }).pagination || {
                currentPage: params.page || 1,
                totalPages: 0,
                totalItems: value.length,
                itemsPerPage: params.limit || 12,
              }
            };
          }
        }
      }

      // Second pass: recursive search for deeply nested structures
      const wordsArray = findWordsArray(data);
      if (wordsArray) {
        console.log('✅ Found words array recursively:', wordsArray.length, 'items');
        return {
          words: wordsArray,
          pagination: (data as { pagination?: unknown }).pagination || {
            currentPage: params.page || 1,
            totalPages: 0,
            totalItems: wordsArray.length,
            itemsPerPage: params.limit || 12,
          }
        };
      }
    }

    // Last resort: return empty array with error logging
    console.error('❌ ERROR: Could not find words in response!');
    console.error('⚠️ Full response structure:', JSON.stringify(data, null, 2));
    console.error('⚠️ Response keys:', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
    console.error('⚠️ Response type:', typeof data, Array.isArray(data));

    // Return empty array instead of returning data as-is (which might not have 'words' property)
    return {
      words: [],
      pagination: {
        currentPage: params.page || 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: params.limit || 12,
      }
    };
  } catch (error) {
    console.error("❌ CRITICAL: Fetch failed with error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack',
    });
    // Return empty results instead of throwing to prevent crashes
    // But log extensively so we can debug
    return {
      words: [],
      pagination: {
        currentPage: params.page || 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: params.limit || 12,
      }
    };
  }
};



export const getWord = async (word: string) => {
  // URL encode the word to handle special characters
  const encodedWord = encodeURIComponent(word);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL environment variable is not set');
    return null;
  }

  try {
    const url = `${apiUrl}/words/words/${encodedWord}`;

    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log("Fetching word from:", url);
    }

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      // Handle different error statuses
      if (res.status === 404) {
        console.log(`Word "${word}" not found (404)`);
        return null;
      }
      throw new Error(`Failed to fetch word: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Log the fetched data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Fetched word data:', JSON.stringify(data, null, 2));
      console.log('📊 Word data structure:', {
        hasWord: !!data?.word,
        hasMeanings: !!data?.meanings,
        meaningsLength: data?.meanings?.length || 0,
        hasEtymology: !!data?.etymology,
        hasPronunciation: !!data?.pronunciation,
        keys: data ? Object.keys(data) : []
      });
    }

    return data;
  } catch (error) {
    console.error("Fetch failed for word:", word, error);

    // Log more details in development
    if (process.env.NODE_ENV === 'development') {
      console.error("API URL:", apiUrl);
      console.error("Full URL:", `${apiUrl}/words/words/${encodedWord}`);
    }

    // Return null instead of throwing to allow UI to handle gracefully
    return null;
  }
};



