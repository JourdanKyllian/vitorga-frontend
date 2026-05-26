import { API_URL } from './config';

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
  Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
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

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Erreur suppression utilisateur');
  },
};