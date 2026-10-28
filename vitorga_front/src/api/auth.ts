import type { AuthUser } from '@/lib/session';
import { apiFetch } from './config';

export type { AuthUser };

export const authApi = {
  login: async (email: string, password: string, remember: boolean): Promise<AuthUser> => {
    let res: Response;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      });
    } catch {
      throw new Error('Erreur réseau: backend inaccessible');
    }
    const data = (await res.json()) as { user?: AuthUser; message?: string };
    if (!res.ok || !data.user) throw new Error(data.message ?? 'Email ou mot de passe incorrect');
    return data.user;
  },

  register: async (data: { firstname: string; lastname: string; email: string; password: string }): Promise<void> => {
    const res = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Erreur inscription');
  },

  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', { method: 'POST' });
  },
};
