import { apiFetch } from './config';

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

export const usersApi = {
  getAll: async (): Promise<UserApi[]> => {
    const res = await apiFetch(`/users`);
    if (!res.ok) throw new Error('Erreur chargement utilisateurs');
    return res.json();
  },

  toggleActive: async (id: number): Promise<UserApi> => {
    const res = await apiFetch(`/users/${id}/toggle-active`, {
      method: 'PATCH',
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
	const res = await apiFetch(`/auth/register`, {
	  method: 'POST',
	  body: JSON.stringify(data),
	})
	if (!res.ok) throw new Error('Erreur création utilisateur')
	return res.json()
  },
  delete: async (id: number): Promise<void> => {
    const res = await apiFetch(`/users/${id}`, {
      method: 'DELETE',
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