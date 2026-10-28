'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Plus, Search, MoreHorizontal, Edit,
  Trash2, Shield, User, Loader2, X,
} from 'lucide-react'
import { usersApi, UserApi } from '../api/users'
import { rolesApi, Role } from '../api/roles'

interface AddUserModalProps {
  onClose: () => void
  onSuccess: (user: UserApi) => void
}

function AddUserModal({ onClose, onSuccess }: AddUserModalProps) {
  const [form, setForm] = useState({
    firstname: '', lastname: '', email: '', password: '', roleId: '',
  })
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    rolesApi.getAll().then(setRoles).catch(() => null)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // 1. Crée le user
      const newUser = await usersApi.register({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        password: form.password,
      })
      // 2. Assigne le rôle si sélectionné
      if (form.roleId) {
        const updated = await usersApi.updateRole(newUser.id, +form.roleId)
        onSuccess(updated)
      } else {
        onSuccess(newUser)
      }
    } catch {
      setError('Erreur lors de la création')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-charcoal">Ajouter un utilisateur</h3>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-lg">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Prénom</label>
              <input
                type="text"
                required
                value={form.firstname}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Nom</label>
              <input
                type="text"
                required
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Mot de passe temporaire
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Rôle</label>
            <select
              value={form.roleId}
              onChange={(e) => setForm({ ...form, roleId: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest bg-white"
            >
              <option value="">Sélectionner un rôle</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.nom}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-cream-dark rounded-xl text-charcoal hover:bg-cream transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-gold hover:bg-gold-dark text-forest font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ChangeRoleModalProps {
  user: UserApi
  onClose: () => void
  onSuccess: (user: UserApi) => void
}

function ChangeRoleModal({ user, onClose, onSuccess }: ChangeRoleModalProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [roleId, setRoleId] = useState(user.role?.id?.toString() ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    rolesApi.getAll().then(setRoles).catch(() => setError('Impossible de charger les rôles'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleId) return
    setIsLoading(true)
    setError('')
    try {
      const updated = await usersApi.updateRole(user.id, +roleId)
      onSuccess(updated)
    } catch {
      setError('Erreur lors du changement de rôle')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-charcoal">Changer le rôle</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-cream rounded-lg">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>

        <p className="text-sm text-charcoal/60 mb-4">
          {user.firstname} {user.lastname} — {user.email}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Rôle</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest bg-white"
            >
              <option value="">Sélectionner un rôle</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.nom}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-cream-dark rounded-xl text-charcoal hover:bg-cream transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !roleId}
              className="flex-1 py-2.5 bg-gold hover:bg-gold-dark text-forest font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserApi[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [roleModal, setRoleModal] = useState<{ userId: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeMenu === null) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeMenu])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await usersApi.getAll()
        setUsers(data)
      } catch {
        setError('Impossible de charger les utilisateurs')
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [])

  const handleToggleActive = async (id: number) => {
    try {
      const updated = await usersApi.toggleActive(id)
      setUsers(users.map(u => u.id === id ? updated : u))
    } catch {
      alert('Erreur lors de la mise à jour')
    }
    setActiveMenu(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await usersApi.delete(id)
      setUsers(users.filter(u => u.id !== id))
    } catch {
      alert('Erreur lors de la suppression')
    }
    setActiveMenu(null)
  }

  const handleUserAdded = (newUser: UserApi) => {
    setUsers([newUser, ...users])
    setShowAddModal(false)
  }

  const handleRoleUpdated = (updated: UserApi) => {
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)))
    setRoleModal(null)
  }

  const filteredUsers = users.filter(user =>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeCount = users.filter(u => u.is_active).length
  const getRoleLabel = (user: UserApi) => user.role?.nom ?? 'Aucun rôle'
  const isAdmin = (user: UserApi) => user.role?.nom?.toLowerCase() === 'admin'
  const roleModalUser = roleModal ? users.find((u) => u.id === roleModal.userId) : undefined

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-forest animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-600">{error}</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Gestion des utilisateurs</h1>
          <p className="text-charcoal/60 mt-1">Gérez les accès et les rôles de votre équipe</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-dark text-forest font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest transition-colors"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white border-2 border-cream-dark rounded-lg">
            <span className="text-charcoal/60 text-sm">Total: </span>
            <span className="font-semibold text-charcoal">{users.length}</span>
          </div>
          <div className="px-4 py-2 bg-forest/10 border-2 border-forest/20 rounded-lg">
            <span className="text-forest/70 text-sm">Actifs: </span>
            <span className="font-semibold text-forest">{activeCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-cream-dark overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Utilisateur</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Rôle</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Date de création</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-charcoal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isAdmin(user) ? 'bg-forest/10' : 'bg-gold/10'
                    }`}>
                      {isAdmin(user)
                        ? <Shield className="w-5 h-5 text-forest" />
                        : <User className="w-5 h-5 text-gold-dark" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">{user.firstname} {user.lastname}</p>
                      <p className="text-sm text-charcoal/60">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isAdmin(user) ? 'bg-forest/10 text-forest' : 'bg-gold/10 text-gold-dark'
                  }`}>
                    {getRoleLabel(user)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {user.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-charcoal/70">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <div
                    ref={activeMenu === user.id ? menuRef : undefined}
                    className="flex items-center justify-end relative"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                      className="p-2 hover:bg-cream rounded-lg transition-colors"
                      aria-expanded={activeMenu === user.id}
                      aria-haspopup="menu"
                    >
                      <MoreHorizontal className="w-5 h-5 text-charcoal/60" />
                    </button>
                    {activeMenu === user.id && (
                      <div className="absolute top-full right-0 mt-1 bg-white border-2 border-cream-dark rounded-xl shadow-lg overflow-hidden z-20 min-w-[180px]">
                        <button
                          type="button"
                          onClick={() => { setRoleModal({ userId: user.id }); setActiveMenu(null) }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-charcoal hover:bg-cream transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Changer le rôle
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleToggleActive(user.id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-charcoal hover:bg-cream transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          {user.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(user.id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                    </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-charcoal/60">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleUserAdded}
        />
      )}

      {roleModalUser && (
        <ChangeRoleModal
          user={roleModalUser}
          onClose={() => setRoleModal(null)}
          onSuccess={handleRoleUpdated}
        />
      )}
    </div>
  )
}