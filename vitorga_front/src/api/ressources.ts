import { apiFetch } from './config';

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

export const ressourcesApi = {
  getAll: async (): Promise<Ressource[]> => {
    const res = await apiFetch('/ressource')
    if (!res.ok) throw new Error('Erreur chargement ressources')
    return res.json()
  },

  create: async (data: Partial<Ressource>): Promise<Ressource> => {
    const res = await apiFetch(`/ressource`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur création ressource');
    return res.json();
  },

  update: async (id: number, data: Partial<Ressource>): Promise<Ressource> => {
    const res = await apiFetch(`/ressource/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur mise à jour ressource');
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await apiFetch(`/ressource/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur suppression ressource');
  },
};