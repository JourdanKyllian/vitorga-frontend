import { apiFetch } from './config';

export interface Parcelle {
  id: number;
  nom: string;
  surface_ha: number;
  localisation: string;
  is_active: boolean;
}

export const parcellesApi = {
  getAll: async (): Promise<Parcelle[]> => {
    const res = await apiFetch('/parcelle');
    if (!res.ok) throw new Error('Erreur chargement parcelles');
    return res.json();
  },

  create: async (data: Partial<Parcelle>): Promise<Parcelle> => {
    const res = await apiFetch('/parcelle', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur création parcelle');
    return res.json();
  },
};