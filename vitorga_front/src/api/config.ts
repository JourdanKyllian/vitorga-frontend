import { clearAuth, getAccessToken } from '../lib/auth-session';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const apiFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken() ?? ''}`,
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    clearAuth();
    window.location.href = '/login';
  }

  return res;
};