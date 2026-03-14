// Category Service
export const getCategories = async (page = 1, limit = 20, search = '') => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  
  const res = await fetch(`${apiUrl}/category?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const getCategoryById = async (id: string, includeWords = false) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const params = includeWords ? '?includeWords=true' : '';
  const res = await fetch(`${apiUrl}/category/${id}${params}`);
  if (!res.ok) throw new Error('Failed to fetch category');
  return res.json();
};

export const createCategory = async (data: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to create category' }));
    throw new Error(error.error || 'Failed to create category');
  }
  return res.json();
};

export const updateCategory = async (id: string, data: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/category/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
};

export const deleteCategory = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/category/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
};

export const addWordToCategory = async (categoryId: string, wordId: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/category/${categoryId}/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wordId })
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to add word to category' }));
    throw new Error(error.error || 'Failed to add word to category');
  }
  return res.json();
};

export const removeWordFromCategory = async (categoryId: string, wordId: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/category/${categoryId}/words/${wordId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to remove word from category');
  return res.json();
};

export const getWordsInCategory = async (categoryId: string, page = 1, limit = 20) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  const res = await fetch(`${apiUrl}/category/${categoryId}/words?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch words in category');
  return res.json();
};

