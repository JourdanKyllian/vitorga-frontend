import { getAccessToken } from '../lib/auth-session';
import { API_URL, apiFetch } from './config';

export interface Ressource {
  id: number;
  nom: string;
  categorie: 'ressource' | 'outil';
  type: string;
  quantite: number;
  unite: string;
  seuil_alerte: number;
  stock_actuel: number;
  created_at: string;
  updated_at: string;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAccessToken() ?? ''}`,
});

export const ressourcesApi = {
  getAll: async (): Promise<Ressource[]> => {
    const res = await apiFetch('/ressource')
    if (!res.ok) throw new Error('Erreur chargement ressources')
    return res.json()
  },

  create: async (data: Partial<Ressource>): Promise<Ressource> => {
    const res = await fetch(`${API_URL}/ressource`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur création ressource');
    return res.json();
  },

  update: async (id: number, data: Partial<Ressource>): Promise<Ressource> => {
    const res = await fetch(`${API_URL}/ressource/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur mise à jour ressource');
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/ressource/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Erreur suppression ressource');
  },
};