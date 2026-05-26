import { useState, useEffect } from 'react'
import { Package, Wrench, AlertTriangle, TrendingDown, Filter, Loader2 } from 'lucide-react'
import { ressourcesApi, Ressource } from '../api/ressources'

type FilterType = 'all' | 'ressource' | 'outil' | 'alerte'

export default function Inventaire() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [items, setItems] = useState<Ressource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ressourcesApi.getAll()
        setItems(data)
      } catch {
        setError('Impossible de charger l\'inventaire')
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [])

  const getFilteredItems = () => {
    switch (filter) {
      case 'ressource':
        return items.filter(item => item.categorie === 'ressource')
      case 'outil':
        return items.filter(item => item.categorie === 'outil')
      case 'alerte':
        return items.filter(item => item.stock_actuel <= item.seuil_alerte)
      default:
        return items
    }
  }

  const filteredItems = getFilteredItems()
  const ressourcesCount = items.filter(i => i.categorie === 'ressource').length
  const outilsCount = items.filter(i => i.categorie === 'outil').length
  const alertesCount = items.filter(i => i.stock_actuel <= i.seuil_alerte).length
  const isLowStock = (item: Ressource) => item.stock_actuel <= item.seuil_alerte

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
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Inventaire & Logistique</h1>
        <p className="text-charcoal/60 mt-1">Gérez vos ressources et équipements</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
            filter === 'all'
              ? 'bg-forest text-cream'
              : 'bg-white border-2 border-cream-dark text-charcoal hover:border-forest/30'
          }`}
        >
          <Filter className="w-4 h-4" />
          Tout ({items.length})
        </button>
        <button
          onClick={() => setFilter('ressource')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
            filter === 'ressource'
              ? 'bg-forest text-cream'
              : 'bg-white border-2 border-cream-dark text-charcoal hover:border-forest/30'
          }`}
        >
          <Package className="w-4 h-4" />
          Ressources ({ressourcesCount})
        </button>
        <button
          onClick={() => setFilter('outil')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
            filter === 'outil'
              ? 'bg-forest text-cream'
              : 'bg-white border-2 border-cream-dark text-charcoal hover:border-forest/30'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Outils ({outilsCount})
        </button>
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

      {/* Inventory Grid */}
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
                {item.categorie === 'ressource' ? (
                  <Package className="w-6 h-6 text-forest" />
                ) : (
                  <Wrench className="w-6 h-6 text-gold-dark" />
                )}
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
                  <p className="text-xs text-charcoal/50">Seuil d&apos;alerte</p>
                  <p className="text-sm font-medium text-charcoal/70">
                    {item.seuil_alerte} {item.unite}
                  </p>
                </div>
              </div>

              <div className="w-full h-2 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isLowStock(item) ? 'bg-red-500' : 'bg-forest'
                  }`}
                  style={{
                    width: `${Math.min((item.stock_actuel / (item.seuil_alerte * 3)) * 100, 100)}%`
                  }}
                />
              </div>

              <div className="pt-3 border-t border-cream-dark flex items-center justify-between">
                <p className="text-xs text-charcoal/50">
                  {new Date(item.updated_at).toLocaleDateString('fr-FR')}
                </p>
                <button className="text-xs font-medium text-forest hover:underline">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-charcoal/30 mx-auto mb-4" />
          <p className="text-charcoal/60">Aucun élément trouvé pour ce filtre</p>
        </div>
      )}
    </div>
  )
}