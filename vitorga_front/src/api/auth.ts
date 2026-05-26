import { API_URL } from './config';
import { clearAuth, isTokenValid, setAuth, type AuthUser } from '../lib/auth-session';

export type { AuthUser };

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
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

  saveSession: (response: LoginResponse, remember: boolean) => {
    setAuth(response.accessToken, response.user, remember);
  },

  logout: () => {
    clearAuth();
  },

  isAuthenticated: () => isTokenValid(),
};

export { clearAuth, getAccessToken, getCurrentUser, getCurrentUserRole, isTokenValid } from '../lib/auth-session';
