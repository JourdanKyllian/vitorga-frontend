import { useState } from 'react'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Shield, User } from 'lucide-react'

interface UserData {
  id: number
  nom: string
  email: string
  role: 'Admin' | 'Vigneron'
  statut: 'Actif' | 'Inactif'
  dateCreation: string
}

const usersData: UserData[] = [
  { id: 1, nom: 'Jean Dupont', email: 'jean.dupont@vitorga.fr', role: 'Admin', statut: 'Actif', dateCreation: '15/01/2024' },
  { id: 2, nom: 'Marie Martin', email: 'marie.martin@vitorga.fr', role: 'Vigneron', statut: 'Actif', dateCreation: '22/02/2024' },
  { id: 3, nom: 'Pierre Durand', email: 'pierre.durand@vitorga.fr', role: 'Vigneron', statut: 'Actif', dateCreation: '08/03/2024' },
  { id: 4, nom: 'Sophie Bernard', email: 'sophie.bernard@vitorga.fr', role: 'Admin', statut: 'Inactif', dateCreation: '14/04/2024' },
  { id: 5, nom: 'Lucas Petit', email: 'lucas.petit@vitorga.fr', role: 'Vigneron', statut: 'Actif', dateCreation: '30/05/2024' },
  { id: 6, nom: 'Emma Leroy', email: 'emma.leroy@vitorga.fr', role: 'Vigneron', statut: 'Actif', dateCreation: '12/06/2024' },
  { id: 7, nom: 'Thomas Moreau', email: 'thomas.moreau@vitorga.fr', role: 'Vigneron', statut: 'Inactif', dateCreation: '25/07/2024' },
]

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMenu, setActiveMenu] = useState<number | null>(null)

  const filteredUsers = usersData.filter(
    user =>
      user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <span className="font-semibold text-charcoal">{usersData.length}</span>
          </div>
          <div className="px-4 py-2 bg-forest/10 border-2 border-forest/20 rounded-lg">
            <span className="text-forest/70 text-sm">Actifs: </span>
            <span className="font-semibold text-forest">{usersData.filter(u => u.statut === 'Actif').length}</span>
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
                      user.role === 'Admin' ? 'bg-forest/10' : 'bg-gold/10'
                    }`}>
                      {user.role === 'Admin' ? (
                        <Shield className="w-5 h-5 text-forest" />
                      ) : (
                        <User className="w-5 h-5 text-gold-dark" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">{user.nom}</p>
                      <p className="text-sm text-charcoal/60">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'Admin' 
                      ? 'bg-forest/10 text-forest' 
                      : 'bg-gold/10 text-gold-dark'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    user.statut === 'Actif'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      user.statut === 'Actif' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    {user.statut}
                  </span>
                </td>
                <td className="px-6 py-4 text-charcoal/70">{user.dateCreation}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                      className="p-2 hover:bg-cream rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5 text-charcoal/60" />
                    </button>
                    {activeMenu === user.id && (
                      <div className="absolute top-full right-0 mt-1 bg-white border-2 border-cream-dark rounded-xl shadow-lg overflow-hidden z-10 min-w-[160px]">
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-charcoal hover:bg-cream transition-colors">
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors">
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
