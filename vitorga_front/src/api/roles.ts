import { apiFetch } from './config'

export interface Role {
  id: number
  nom: string
}

export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    const res = await apiFetch('/role')
    if (!res.ok) throw new Error('Erreur chargement rôles')
    return res.json()
  },
}