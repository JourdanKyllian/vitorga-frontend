import { useState, useEffect } from 'react'
import {
  Plus, Search, MoreHorizontal, Edit,
  Trash2, Shield, User, Loader2,
} from 'lucide-react'
import { usersApi, UserApi } from '../api/users'

export default function AdminUsers() {
  const [users, setUsers] = useState<UserApi[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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

  const filteredUsers = users.filter(
    user =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeCount = users.filter(u => u.is_active).length
  const getRoleLabel = (user: UserApi) => user.role?.nom ?? 'Aucun rôle'
  const isAdmin = (user: UserApi) => user.role?.id === 1 || user.role?.nom === 'Admin'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-forest animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Gestion des utilisateurs</h1>
          <p className="text-charcoal/60 mt-1">Gérez les accès et les rôles de votre équipe</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-dark text-forest font-semibold rounded-xl transition-colors">
          <Plus className="w-5 h-5" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Search & Stats */}
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

      {/* Users Table */}
      <div className="bg-white rounded-xl border-2 border-cream-dark overflow-hidden">
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
                      {isAdmin(user) ? (
                        <Shield className="w-5 h-5 text-forest" />
                      ) : (
                        <User className="w-5 h-5 text-gold-dark" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-sm text-charcoal/60">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isAdmin(user)
                      ? 'bg-forest/10 text-forest'
                      : 'bg-gold/10 text-gold-dark'
                  }`}>
                    {getRoleLabel(user)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    user.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      user.is_active ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    {user.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-charcoal/70">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                      className="p-2 hover:bg-cream rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5 text-charcoal/60" />
                    </button>
                    {activeMenu === user.id && (
                      <div className="absolute top-full right-0 mt-1 bg-white border-2 border-cream-dark rounded-xl shadow-lg overflow-hidden z-10 min-w-[180px]">
                        <button
                          onClick={() => void handleToggleActive(user.id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-charcoal hover:bg-cream transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          {user.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
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
    </div>
  )
}