import { getAccessToken } from '../lib/auth-session';
import { API_URL, apiFetch } from './config';

export interface UserApi {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  is_active: boolean;
  created_at: string;
  role?: {
    id: number;
    nom: string;
  };
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAccessToken() ?? ''}`,
});

export const usersApi = {
  getAll: async (): Promise<UserApi[]> => {
    const res = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Erreur chargement utilisateurs');
    return res.json();
  },

  toggleActive: async (id: number): Promise<UserApi> => {
    const res = await fetch(`${API_URL}/users/${id}/toggle-active`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Erreur mise à jour utilisateur');
    return res.json();
  },
  register: async (data: {
	firstname: string
	lastname: string
	email: string
	password: string
  }): Promise<UserApi> => {
	const res = await fetch(`${API_URL}/auth/register`, {
	  method: 'POST',
	  headers: getHeaders(),
	  body: JSON.stringify(data),
	})
	if (!res.ok) throw new Error('Erreur création utilisateur')
	return res.json()
  },
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Erreur suppression utilisateur');
  },
  updateRole: async (userId: number, roleId: number): Promise<UserApi> => {
	const res = await apiFetch(`/users/${userId}/role`, {
	  method: 'PATCH',
	  body: JSON.stringify({ roleId }),
	})
	if (!res.ok) throw new Error('Erreur mise à jour rôle')
	return res.json()
  },
};