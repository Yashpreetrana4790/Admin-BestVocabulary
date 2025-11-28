// Homophones Service
export const getHomophones = async (page = 1, limit = 20, search = '') => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  
  const res = await fetch(`${apiUrl}/categories/homophones?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch homophones');
  return res.json();
};

export const getHomophoneById = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/homophones/${id}`);
  if (!res.ok) throw new Error('Failed to fetch homophone');
  return res.json();
};

export const createHomophone = async (data: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/homophones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create homophone');
  return res.json();
};

export const updateHomophone = async (id: string, data: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/homophones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update homophone');
  return res.json();
};

export const deleteHomophone = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/homophones/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete homophone');
  return res.json();
};

// Homonyms Service
export const getHomonyms = async (page = 1, limit = 20, search = '') => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  
  const res = await fetch(`${apiUrl}/categories/homonyms?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch homonyms');
  return res.json();
};

export const getHomonymById = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/homonyms/${id}`);
  if (!res.ok) throw new Error('Failed to fetch homonym');
  return res.json();
};

export const createHomonym = async (data: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/homonyms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create homonym');
  return res.json();
};

export const updateHomonym = async (id: string, data: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/homonyms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update homonym');
  return res.json();
};

export const deleteHomonym = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/homonyms/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete homonym');
  return res.json();
};

// Confused Words Service
export const getConfusedWords = async (page = 1, limit = 20, search = '') => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  
  const res = await fetch(`${apiUrl}/categories/confused-words?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch confused words');
  return res.json();
};

export const getConfusedWordsById = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/confused-words/${id}`);
  if (!res.ok) throw new Error('Failed to fetch confused words');
  return res.json();
};

export const createConfusedWords = async (data: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/confused-words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create confused words');
  return res.json();
};

export const updateConfusedWords = async (id: string, data: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/confused-words/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update confused words');
  return res.json();
};

export const deleteConfusedWords = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
  
  const res = await fetch(`${apiUrl}/categories/confused-words/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete confused words');
  return res.json();
};

