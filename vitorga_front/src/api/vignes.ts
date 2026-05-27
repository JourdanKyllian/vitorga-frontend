import { apiFetch } from './config';

export interface Vigne {
  id: number;
  nom: string;
  annee_plantation: number;
  densite: number;
  surface_ha: number;
  exposition: 'SUD' | 'EST' | 'NORD' | 'OUEST';
  poids_moyen_grappe: number;
  is_active: boolean;
  parcelle?: { id: number; nom: string };
}

export const vignesApi = {
  getAll: async (): Promise<Vigne[]> => {
    const res = await apiFetch('/vigne');
    if (!res.ok) throw new Error('Erreur chargement vignes');
    return res.json();
  },

  getByParcelle: async (parcelleId: number): Promise<Vigne[]> => {
    const res = await apiFetch(`/vigne?parcelle_id=${parcelleId}`);
    if (!res.ok) throw new Error('Erreur chargement vignes');
    return res.json();
  },

  create: async (data: Partial<Vigne> & { parcelle_id?: number }): Promise<Vigne> => {
    const res = await apiFetch('/vigne', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur création vigne');
    return res.json();
  },
};