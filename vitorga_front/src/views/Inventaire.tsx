'use client'

import { useState, useEffect } from 'react'
import {
  Package, Wrench, AlertTriangle, TrendingDown,
  Filter, Loader2, Plus, Minus, X,
} from 'lucide-react'
import { ressourcesApi, Ressource } from '../api/ressources'
import { useSession } from '../components/SessionProvider'

type FilterType = 'all' | 'ressource' | 'outil' | 'alerte'

// ── Modal ajuster stock ──────────────────────────────────────────
interface AdjustModalProps {
  item: Ressource
  mode: 'add' | 'remove'
  onClose: () => void
  onConfirm: (quantity: number) => void
}

function AdjustModal({ item, mode, onClose, onConfirm }: AdjustModalProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-charcoal">
              {mode === 'add' ? 'Ajouter du stock' : 'Retirer du stock'}
            </h3>
            <p className="text-charcoal/60 text-sm">{item.nom}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-lg">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">
            Quantité ({item.unite})
          </label>
          <input
            type="number"
            min={1}
            max={mode === 'remove' ? item.stock_actuel : undefined}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
            className="w-full px-4 py-3 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
          />
          {mode === 'remove' && (
            <p className="text-xs text-charcoal/50 mt-1">
              Stock actuel : {item.stock_actuel} {item.unite}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border-2 border-cream-dark rounded-xl text-charcoal hover:bg-cream transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(quantity)}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-colors ${
              mode === 'add'
                ? 'bg-forest text-cream hover:bg-forest/90'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Modal ajouter ressource ──────────────────────────────────────
interface AddRessourceModalProps {
  onClose: () => void
  onSuccess: (item: Ressource) => void
}

function AddRessourceModal({ onClose, onSuccess }: AddRessourceModalProps) {
  const [form, setForm] = useState({
    nom: '',
    categorie: 'ressource' as 'ressource' | 'outil',
    type: '',
    stock_actuel: 0,
    seuil_alerte: 0,
    unite: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const created = await ressourcesApi.create(form)
      onSuccess(created)
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
          <h3 className="text-lg font-bold text-charcoal">Nouvelle ressource</h3>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-lg">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Nom *</label>
            <input
              type="text"
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Ex: Soufre en poudre"
              className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Catégorie *</label>
              <select
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value as 'ressource' | 'outil' })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest bg-white"
              >
                <option value="ressource">Ressource</option>
                <option value="outil">Outil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Type</label>
              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Ex: Traitement"
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Stock initial *</label>
              <input
                type="number"
                min={0}
                required
                value={form.stock_actuel}
                onChange={(e) => setForm({ ...form, stock_actuel: +e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Seuil alerte *</label>
              <input
                type="number"
                min={0}
                required
                value={form.seuil_alerte}
                onChange={(e) => setForm({ ...form, seuil_alerte: +e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Unité *</label>
              <input
                type="text"
                required
                value={form.unite}
                onChange={(e) => setForm({ ...form, unite: e.target.value })}
                placeholder="kg, L..."
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest"
              />
            </div>
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
              {isLoading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Page principale ──────────────────────────────────────────────
export default function Inventaire() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [items, setItems] = useState<Ressource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState<{ item: Ressource; mode: 'add' | 'remove' } | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const user = useSession()
  const isAdmin = user?.role?.toLowerCase() === 'admin'

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ressourcesApi.getAll()
        setItems(data)
      } catch {
        setError("Impossible de charger l'inventaire")
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [])

  const handleAdjust = async (quantity: number) => {
    if (!modal) return
    const { item, mode } = modal
    const newStock = mode === 'add'
      ? item.stock_actuel + quantity
      : item.stock_actuel - quantity

    if (newStock < 0) {
      alert('Stock insuffisant')
      return
    }

    try {
      const updated = await ressourcesApi.update(item.id, { stock_actuel: newStock })
      setItems(items.map(i => i.id === item.id ? updated : i))
    } catch {
      alert('Erreur lors de la mise à jour')
    }
    setModal(null)
  }

  const handleRessourceAdded = (newItem: Ressource) => {
    setItems([newItem, ...items])
    setShowAddModal(false)
  }

  const getFilteredItems = () => {
    switch (filter) {
      case 'ressource': return items.filter(i => i.categorie === 'ressource')
      case 'outil': return items.filter(i => i.categorie === 'outil')
      case 'alerte': return items.filter(i => i.stock_actuel <= i.seuil_alerte)
      default: return items
    }
  }

  const filteredItems = getFilteredItems()
  const ressourcesCount = items.filter(i => i.categorie === 'ressource').length
  const outilsCount = items.filter(i => i.categorie === 'outil').length
  const alertesCount = items.filter(i => i.stock_actuel <= i.seuil_alerte).length
  const isLowStock = (item: Ressource) => item.stock_actuel <= item.seuil_alerte

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Inventaire & Logistique</h1>
          <p className="text-charcoal/60 mt-1">
            Bonjour {user?.firstname} —{' '}
            {isAdmin
              ? 'Vous pouvez ajouter et retirer du stock'
              : 'Vous pouvez retirer du stock'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-dark text-forest font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvelle ressource
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { key: 'all', label: `Tout (${items.length})`, icon: Filter },
          { key: 'ressource', label: `Ressources (${ressourcesCount})`, icon: Package },
          { key: 'outil', label: `Outils (${outilsCount})`, icon: Wrench },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key as FilterType)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
              filter === key
                ? 'bg-forest text-cream'
                : 'bg-white border-2 border-cream-dark text-charcoal hover:border-forest/30'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
        <button
          onClick={() => setFilter('alerte')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
            filter === 'alerte'
              ? 'bg-red-600 text-white'
              : 'bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Alertes ({alertesCount})
        </button>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-md ${
              isLowStock(item) ? 'border-red-300 bg-red-50/30' : 'border-cream-dark'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                item.categorie === 'ressource' ? 'bg-forest/10' : 'bg-gold/10'
              }`}>
                {item.categorie === 'ressource'
                  ? <Package className="w-6 h-6 text-forest" />
                  : <Wrench className="w-6 h-6 text-gold-dark" />
                }
              </div>
              {isLowStock(item) && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 rounded-full">
                  <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-xs font-medium text-red-600">Stock bas</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-charcoal">{item.nom}</h3>
                <p className="text-sm text-charcoal/60">{item.type}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-charcoal/50 mb-1">Stock actuel</p>
                  <p className={`text-2xl font-bold ${isLowStock(item) ? 'text-red-600' : 'text-charcoal'}`}>
                    {item.stock_actuel.toLocaleString()}
                    <span className="text-sm font-normal text-charcoal/60 ml-1">{item.unite}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-charcoal/50">Seuil alerte</p>
                  <p className="text-sm font-medium text-charcoal/70">
                    {item.seuil_alerte} {item.unite}
                  </p>
                </div>
              </div>

              <div className="w-full h-2 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isLowStock(item) ? 'bg-red-500' : 'bg-forest'}`}
                  style={{
                    width: `${Math.min(
                      (item.stock_actuel / Math.max(item.seuil_alerte * 3, 1)) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>

              <div className="pt-3 border-t border-cream-dark flex gap-2">
                {isAdmin && (
                  <button
                    onClick={() => setModal({ item, mode: 'add' })}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-forest/10 text-forest rounded-lg hover:bg-forest/20 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                )}
                <button
                  onClick={() => setModal({ item, mode: 'remove' })}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <Minus className="w-4 h-4" />
                  Retirer
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carte "Ajouter" visible seulement pour les admins */}
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white rounded-xl border-2 border-dashed border-cream-dark p-5 flex flex-col items-center justify-center gap-3 hover:border-forest/40 hover:bg-forest/5 transition-all min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-forest" />
            </div>
            <p className="text-charcoal/60 font-medium text-sm">Ajouter une ressource</p>
          </button>
        )}
      </div>

      {filteredItems.length === 0 && items.length > 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-charcoal/30 mx-auto mb-4" />
          <p className="text-charcoal/60">Aucun élément trouvé pour ce filtre</p>
        </div>
      )}

      {modal && (
        <AdjustModal
          item={modal.item}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onConfirm={(q) => void handleAdjust(q)}
        />
      )}

      {showAddModal && (
        <AddRessourceModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleRessourceAdded}
        />
      )}
    </div>
  )
}