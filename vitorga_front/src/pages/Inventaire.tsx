import { useState } from 'react'
import { Package, Wrench, AlertTriangle, TrendingDown, Filter } from 'lucide-react'

interface InventoryItem {
  id: number
  nom: string
  categorie: 'ressource' | 'outil'
  type: string
  quantite: number
  unite: string
  seuilAlerte: number
  derniereMaj: string
}

const inventaireData: InventoryItem[] = [
  { id: 1, nom: 'Engrais NPK', categorie: 'ressource', type: 'Engrais', quantite: 250, unite: 'kg', seuilAlerte: 100, derniereMaj: '10/03/2024' },
  { id: 2, nom: 'Bouillie bordelaise', categorie: 'ressource', type: 'Traitement', quantite: 45, unite: 'L', seuilAlerte: 50, derniereMaj: '08/03/2024' },
  { id: 3, nom: 'Soufre micronisé', categorie: 'ressource', type: 'Traitement', quantite: 80, unite: 'kg', seuilAlerte: 30, derniereMaj: '05/03/2024' },
  { id: 4, nom: 'Compost organique', categorie: 'ressource', type: 'Engrais', quantite: 1200, unite: 'kg', seuilAlerte: 500, derniereMaj: '01/03/2024' },
  { id: 5, nom: 'Sulfate de cuivre', categorie: 'ressource', type: 'Traitement', quantite: 15, unite: 'kg', seuilAlerte: 20, derniereMaj: '28/02/2024' },
  { id: 6, nom: 'Sécateurs électriques', categorie: 'outil', type: 'Taille', quantite: 8, unite: 'unités', seuilAlerte: 3, derniereMaj: '15/02/2024' },
  { id: 7, nom: 'Tracteur vigneron', categorie: 'outil', type: 'Véhicule', quantite: 2, unite: 'unités', seuilAlerte: 1, derniereMaj: '01/02/2024' },
  { id: 8, nom: 'Pulvérisateur', categorie: 'outil', type: 'Traitement', quantite: 3, unite: 'unités', seuilAlerte: 2, derniereMaj: '20/01/2024' },
  { id: 9, nom: 'Cisailles à vendanger', categorie: 'outil', type: 'Récolte', quantite: 25, unite: 'unités', seuilAlerte: 10, derniereMaj: '10/01/2024' },
  { id: 10, nom: 'Broyeur à sarments', categorie: 'outil', type: 'Entretien', quantite: 1, unite: 'unité', seuilAlerte: 1, derniereMaj: '05/01/2024' },
  { id: 11, nom: 'Fertilisant foliaire', categorie: 'ressource', type: 'Engrais', quantite: 30, unite: 'L', seuilAlerte: 25, derniereMaj: '12/03/2024' },
  { id: 12, nom: 'Liens biodégradables', categorie: 'ressource', type: 'Accessoire', quantite: 5000, unite: 'pcs', seuilAlerte: 1000, derniereMaj: '18/02/2024' },
]

type FilterType = 'all' | 'ressource' | 'outil' | 'alerte'

export default function Inventaire() {
  const [filter, setFilter] = useState<FilterType>('all')

  const getFilteredItems = () => {
    switch (filter) {
      case 'ressource':
        return inventaireData.filter(item => item.categorie === 'ressource')
      case 'outil':
        return inventaireData.filter(item => item.categorie === 'outil')
      case 'alerte':
        return inventaireData.filter(item => item.quantite <= item.seuilAlerte)
      default:
        return inventaireData
    }
  }

  const filteredItems = getFilteredItems()
  const ressourcesCount = inventaireData.filter(i => i.categorie === 'ressource').length
  const outilsCount = inventaireData.filter(i => i.categorie === 'outil').length
  const alertesCount = inventaireData.filter(i => i.quantite <= i.seuilAlerte).length

  const isLowStock = (item: InventoryItem) => item.quantite <= item.seuilAlerte

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
          Tout ({inventaireData.length})
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
            {/* Header */}
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

            {/* Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-charcoal">{item.nom}</h3>
                <p className="text-sm text-charcoal/60">{item.type}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-charcoal/50 mb-1">Quantité</p>
                  <p className={`text-2xl font-bold ${isLowStock(item) ? 'text-red-600' : 'text-charcoal'}`}>
                    {item.quantite.toLocaleString()}
                    <span className="text-sm font-normal text-charcoal/60 ml-1">{item.unite}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-charcoal/50">Seuil d&apos;alerte</p>
                  <p className="text-sm font-medium text-charcoal/70">{item.seuilAlerte} {item.unite}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isLowStock(item) ? 'bg-red-500' : 'bg-forest'
                  }`}
                  style={{
                    width: `${Math.min((item.quantite / (item.seuilAlerte * 3)) * 100, 100)}%`
                  }}
                />
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-cream-dark flex items-center justify-between">
                <p className="text-xs text-charcoal/50">
                  Mis à jour le {item.derniereMaj}
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
