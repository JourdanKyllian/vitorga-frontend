import { API_URL } from './config';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
  };
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Email ou mot de passe incorrect');
    return res.json();
  },

  register: async (data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }): Promise<void> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur inscription');
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => !!localStorage.getItem('accessToken'),
};