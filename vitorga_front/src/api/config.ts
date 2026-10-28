export const apiFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  const res = await fetch(`/api/backend${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    window.location.href = '/login';
  }

  return res;
};
