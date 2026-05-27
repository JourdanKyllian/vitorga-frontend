import { apiFetch } from './config';

export interface DashboardKPIs {
  totalRessources: number;
  ressourcesEnAlerte: number;
  criticiteGlobale: number;
  totalVignes: number;
  superficieTotale: number;
}

export interface StockProjection {
  id: number;
  nom: string;
  unite: string;
  stock_actuel: number;
  stock_projete: number;
  seuil_alerte: number;
  is_alerte: boolean;
  criticite: number;
}

export interface RendementParcelle {
  parcelle: string;
  surface_ha: number;
  rendement: number;
  objectif: number;
}

export const statsApi = {
  getDashboard: async (): Promise<DashboardKPIs> => {
    const res = await apiFetch('/stats/dashboard');
    if (!res.ok) throw new Error('Erreur stats');
    return res.json();
  },

  getStockProjections: async (): Promise<StockProjection[]> => {
    const res = await apiFetch('/stats/stock-projections');
    if (!res.ok) throw new Error('Erreur projections');
    return res.json();
  },

  getRendements: async (): Promise<RendementParcelle[]> => {
    const res = await apiFetch('/stats/rendements');
    if (!res.ok) throw new Error('Erreur rendements');
    return res.json();
  },

  getTopCritiques: async (): Promise<StockProjection[]> => {
    const res = await apiFetch('/stats/critiques');
    if (!res.ok) throw new Error('Erreur critiques');
    return res.json();
  },
};