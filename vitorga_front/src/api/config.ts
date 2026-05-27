import { clearAuth, getAccessToken } from '../lib/auth-session';

const explicitApiUrl = import.meta.env.VITE_API_URL;

export const API_URL =
  explicitApiUrl ?? 'http://localhost';

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