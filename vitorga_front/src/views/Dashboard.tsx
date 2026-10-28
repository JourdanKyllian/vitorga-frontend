'use client'

import { useState, useEffect } from 'react'
import {
  Thermometer, MapPin, AlertTriangle,
  ChevronDown, Package, TrendingDown, Loader2, Plus, X,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import KPICard from '../components/KPICard'
import ChartCard from '../components/ChartCard'
import { statsApi, DashboardKPIs, StockProjection, RendementParcelle } from '../api/stats'
import { parcellesApi, Parcelle } from '../api/parcelles'
import { vignesApi } from '../api/vignes'
import { useSession } from '../components/SessionProvider'

const climatData = [
  { mois: 'Jan', temperature: 5, humidite: 78 },
  { mois: 'Fév', temperature: 7, humidite: 72 },
  { mois: 'Mar', temperature: 12, humidite: 65 },
  { mois: 'Avr', temperature: 15, humidite: 60 },
  { mois: 'Mai', temperature: 19, humidite: 55 },
  { mois: 'Juin', temperature: 24, humidite: 48 },
  { mois: 'Juil', temperature: 28, humidite: 42 },
  { mois: 'Août', temperature: 27, humidite: 45 },
  { mois: 'Sep', temperature: 22, humidite: 52 },
  { mois: 'Oct', temperature: 16, humidite: 62 },
  { mois: 'Nov', temperature: 10, humidite: 70 },
  { mois: 'Déc', temperature: 6, humidite: 76 },
]

// ── Modal nouvelle parcelle ──────────────────────────────────────
interface AddParcelleModalProps {
  onClose: () => void
  onSuccess: (p: Parcelle) => void
}

function AddParcelleModal({ onClose, onSuccess }: AddParcelleModalProps) {
  const [form, setForm] = useState({ nom: '', surface_ha: 0, localisation: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const created = await parcellesApi.create(form)
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
          <h3 className="text-lg font-bold text-charcoal">Nouvelle parcelle</h3>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-lg">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
        )}
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Nom *</label>
            <input type="text" required value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Ex: Parcelle Nord - Chardonnay"
              className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Surface (ha) *</label>
              <input type="number" min={0} step={0.1} required value={form.surface_ha}
                onChange={(e) => setForm({ ...form, surface_ha: +e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Localisation</label>
              <input type="text" value={form.localisation}
                onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                placeholder="Ex: Zone Nord"
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border-2 border-cream-dark rounded-xl text-charcoal hover:bg-cream transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 bg-gold hover:bg-gold-dark text-forest font-semibold rounded-xl transition-colors disabled:opacity-50">
              {isLoading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal nouvelle vigne ─────────────────────────────────────────
interface AddVigneModalProps {
  parcelles: Parcelle[]
  onClose: () => void
  onSuccess: () => void
}

function AddVigneModal({ parcelles, onClose, onSuccess }: AddVigneModalProps) {
  const [form, setForm] = useState({
    nom: '',
    annee_plantation: new Date().getFullYear() - 10,
    densite: 5000,
    surface_ha: 1,
    exposition: 'SUD' as 'SUD' | 'EST' | 'NORD' | 'OUEST',
    poids_moyen_grappe: 0.15,
    parcelle_id: parcelles[0]?.id ?? 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const age = new Date().getFullYear() - form.annee_plantation
  const tauxPerte = age < 5 ? '30%' : age <= 15 ? '10%' : '5%'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.parcelle_id) {
      setError('Veuillez sélectionner une parcelle')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await vignesApi.create(form)
      onSuccess()
    } catch {
      setError('Erreur lors de la création')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-charcoal">Nouvelle vigne</h3>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-lg">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
        )}
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">

          {/* Parcelle associée */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Parcelle associée *
            </label>
            {parcelles.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                Créez d&apos;abord une parcelle avant d&apos;ajouter une vigne.
              </div>
            ) : (
              <select
                value={form.parcelle_id}
                onChange={(e) => setForm({ ...form, parcelle_id: +e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest bg-white"
              >
                {parcelles.map(p => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Nom *</label>
            <input type="text" required value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Ex: Chardonnay Nord"
              className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Année plantation *</label>
              <input type="number" required min={1900} max={new Date().getFullYear()}
                value={form.annee_plantation}
                onChange={(e) => setForm({ ...form, annee_plantation: +e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Densité (pieds/ha) *</label>
              <input type="number" required min={1000} max={10000}
                value={form.densite}
                onChange={(e) => setForm({ ...form, densite: +e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Surface (ha) *</label>
              <input type="number" required min={0.1} step={0.1}
                value={form.surface_ha}
                onChange={(e) => setForm({ ...form, surface_ha: +e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Exposition *</label>
              <select value={form.exposition}
                onChange={(e) => setForm({ ...form, exposition: e.target.value as typeof form.exposition })}
                className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest bg-white">
                <option value="SUD">SUD (+10%)</option>
                <option value="EST">EST (+5%)</option>
                <option value="OUEST">OUEST (neutre)</option>
                <option value="NORD">NORD (-15%)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Poids moyen grappe (kg)
            </label>
            <input type="number" min={0.05} max={0.5} step={0.01}
              value={form.poids_moyen_grappe}
              onChange={(e) => setForm({ ...form, poids_moyen_grappe: +e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest" />
            <p className="text-xs text-charcoal/40 mt-1">
              Âge : {age} ans — Taux de perte : {tauxPerte}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border-2 border-cream-dark rounded-xl text-charcoal hover:bg-cream transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={isLoading || parcelles.length === 0}
              className="flex-1 py-2.5 bg-forest hover:bg-forest/90 text-cream font-semibold rounded-xl transition-colors disabled:opacity-50">
              {isLoading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Dashboard principal ──────────────────────────────────────────
export default function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [rendements, setRendements] = useState<RendementParcelle[]>([])
  const [critiques, setCritiques] = useState<StockProjection[]>([])
  const [parcelles, setParcelles] = useState<Parcelle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedParcelle, setSelectedParcelle] = useState('all')
  const [showAddParcelle, setShowAddParcelle] = useState(false)
  const [showAddVigne, setShowAddVigne] = useState(false)

  const user = useSession()
  const isAdmin = user?.role?.toLowerCase() === 'admin'

  const loadData = async () => {
    try {
      const [kpiData, rendData, critData, parcData] = await Promise.all([
        statsApi.getDashboard(),
        statsApi.getRendements(),
        statsApi.getTopCritiques(),
        parcellesApi.getAll(),
      ])
      setKpis(kpiData)
      setRendements(rendData)
      setCritiques(critData)
      setParcelles(parcData)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData().catch(console.error)
  }, [])

  const handleParcelleAdded = (p: Parcelle) => {
    setParcelles(prev => [...prev, p])
    setShowAddParcelle(false)
  }

  const handleVigneAdded = async () => {
    setShowAddVigne(false)
    // Recharge tout pour voir les nouveaux rendements
    await loadData()
  }

  const getRisqueVariant = (criticite: number) => {
    if (criticite >= 75) return 'danger'
    if (criticite >= 40) return 'warning'
    return 'default'
  }

  const getRisqueLabel = (criticite: number) => {
    if (criticite >= 75) return 'Élevé'
    if (criticite >= 40) return 'Modéré'
    return 'Faible'
  }

  const parcelleOptions = [
    { id: 'all', name: 'Toutes les parcelles' },
    ...parcelles.map(p => ({ id: String(p.id), name: p.nom })),
  ]

  const selectedRendement = selectedParcelle === 'all'
    ? rendements
    : rendements.filter(r =>
        r.parcelle === parcelles.find(p => String(p.id) === selectedParcelle)?.nom,
      )

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-forest animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Tableau de bord</h1>
          <p className="text-charcoal/60 mt-1">
            Bonjour {user?.firstname} — Vue d&apos;ensemble de votre exploitation
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <button
                onClick={() => setShowAddParcelle(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-dark text-forest font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nouvelle parcelle
              </button>
              <button
                onClick={() => setShowAddVigne(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest/90 text-cream font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nouvelle vigne
              </button>
            </>
          )}

          {/* Dropdown parcelles */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-cream-dark rounded-xl hover:border-forest/30 transition-colors min-w-[260px]"
            >
              <MapPin className="w-5 h-5 text-forest" />
              <span className="flex-1 text-left text-charcoal font-medium">
                {parcelleOptions.find(p => p.id === selectedParcelle)?.name ?? 'Toutes les parcelles'}
              </span>
              <ChevronDown className={`w-5 h-5 text-charcoal/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white border-2 border-cream-dark rounded-xl shadow-lg overflow-hidden z-10">
                {parcelleOptions.map((p) => (
                  <button key={p.id}
                    onClick={() => { setSelectedParcelle(p.id); setIsDropdownOpen(false) }}
                    className={`w-full px-4 py-3 text-left hover:bg-cream transition-colors ${
                      selectedParcelle === p.id ? 'bg-forest/5 text-forest font-medium' : 'text-charcoal'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
                {parcelles.length === 0 && (
                  <p className="px-4 py-3 text-sm text-charcoal/40">
                    Aucune parcelle — cliquez sur &quot;Nouvelle parcelle&quot;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Ressources en alerte"
          value={kpis?.ressourcesEnAlerte ?? 0}
          unit={`/ ${kpis?.totalRessources ?? 0}`}
          icon={AlertTriangle}
          variant={kpis && kpis.ressourcesEnAlerte > 0 ? 'danger' : 'default'}
        />
        <KPICard
          title="Criticité stock"
          value={`${kpis?.criticiteGlobale ?? 0}%`}
          icon={Package}
          variant={getRisqueVariant(kpis?.criticiteGlobale ?? 0)}
        />
        <KPICard
          title="Superficie totale"
          value={kpis?.superficieTotale ?? 0}
          unit="ha"
          icon={MapPin}
        />
        <KPICard
          title="Risque global"
          value={getRisqueLabel(kpis?.criticiteGlobale ?? 0)}
          icon={Thermometer}
          variant={getRisqueVariant(kpis?.criticiteGlobale ?? 0)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Évolution climatique annuelle">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={climatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e6" />
                <XAxis dataKey="mois" tick={{ fill: '#1a1a1a', fontSize: 12 }} axisLine={{ stroke: '#f5f0e6' }} />
                <YAxis yAxisId="temp" tick={{ fill: '#1a1a1a', fontSize: 12 }} axisLine={{ stroke: '#f5f0e6' }} label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#1a1a1a' }} />
                <YAxis yAxisId="humidity" orientation="right" tick={{ fill: '#1a1a1a', fontSize: 12 }} axisLine={{ stroke: '#f5f0e6' }} label={{ value: '%', angle: 90, position: 'insideRight', fill: '#1a1a1a' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #f5f0e6', borderRadius: '8px' }} />
                <Legend />
                <Line yAxisId="temp" type="monotone" dataKey="temperature" name="Température" stroke="#dcab24" strokeWidth={3} dot={{ fill: '#dcab24', strokeWidth: 2 }} />
                <Line yAxisId="humidity" type="monotone" dataKey="humidite" name="Humidité" stroke="#023226" strokeWidth={3} dot={{ fill: '#023226', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Rendements par parcelle — YieldCalculator">
          {selectedRendement.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center gap-3 text-charcoal/40">
              <MapPin className="w-10 h-10" />
              <p className="text-sm text-center">
                Ajoutez des parcelles et associez-y des vignes<br />pour voir les rendements calculés
              </p>
              {isAdmin && (
                <div className="flex gap-2">
                  <button onClick={() => setShowAddParcelle(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-gold text-forest rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors">
                    <Plus className="w-4 h-4" /> Parcelle
                  </button>
                  <button onClick={() => setShowAddVigne(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-forest text-cream rounded-xl text-sm font-medium hover:bg-forest/90 transition-colors">
                    <Plus className="w-4 h-4" /> Vigne
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedRendement} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e6" />
                  <XAxis dataKey="parcelle" tick={{ fill: '#1a1a1a', fontSize: 12 }} axisLine={{ stroke: '#f5f0e6' }} />
                  <YAxis tick={{ fill: '#1a1a1a', fontSize: 12 }} axisLine={{ stroke: '#f5f0e6' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #f5f0e6', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="rendement" name="Rendement calculé (kg/ha)" fill="#023226" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="objectif" name="Objectif (+10%)" fill="#dcab24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Stock Projections */}
      <ChartCard title="Projection des stocks — StockProjectionCalculator">
        {critiques.length === 0 ? (
          <div className="py-8 flex flex-col items-center gap-3 text-charcoal/40">
            <Package className="w-10 h-10" />
            <p className="text-sm">Aucune ressource critique pour l&apos;instant</p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {critiques.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-charcoal truncate">{item.nom}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-charcoal/50 w-20">Actuel</span>
                    <div className="flex-1 h-3 bg-cream-dark rounded-full overflow-hidden">
                      <div className="h-full bg-forest rounded-full"
                        style={{ width: `${Math.min((item.stock_actuel / Math.max(item.seuil_alerte * 3, 1)) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs font-medium w-20 text-right">{item.stock_actuel} {item.unite}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-charcoal/50 w-20">Projeté</span>
                    <div className="flex-1 h-3 bg-cream-dark rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.is_alerte ? 'bg-red-500' : 'bg-gold'}`}
                        style={{ width: `${Math.min(Math.max((item.stock_projete / Math.max(item.seuil_alerte * 3, 1)) * 100, 0), 100)}%` }} />
                    </div>
                    <span className={`text-xs font-medium w-20 text-right ${item.is_alerte ? 'text-red-600' : 'text-charcoal'}`}>
                      {item.stock_projete} {item.unite}
                    </span>
                  </div>
                </div>
                <div className={`w-14 text-center px-2 py-1 rounded-full text-xs font-bold ${
                  item.criticite >= 75 ? 'bg-red-100 text-red-600'
                  : item.criticite >= 40 ? 'bg-amber-100 text-amber-600'
                  : 'bg-green-100 text-green-600'
                }`}>
                  {Math.round(item.criticite)}%
                </div>
                {item.is_alerte && <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </ChartCard>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border-2 border-cream-dark p-5">
          <p className="text-sm text-charcoal/60 mb-1">Parcelles actives</p>
          <p className="text-3xl font-bold text-charcoal">{parcelles.length}</p>
          <p className="text-xs text-charcoal/40 mt-1">Enregistrées en BDD</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-cream-dark p-5">
          <p className="text-sm text-charcoal/60 mb-1">Stock projection</p>
          <p className="text-3xl font-bold text-charcoal">
            {critiques.filter(c => c.is_alerte).length}
            <span className="text-lg text-charcoal/40"> / {critiques.length}</span>
          </p>
          <p className="text-xs text-charcoal/40 mt-1">Ressources sous seuil après interventions</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-cream-dark p-5">
          <p className="text-sm text-charcoal/60 mb-1">Vignes actives</p>
          <p className="text-3xl font-bold text-charcoal">
            {kpis?.totalVignes ?? 0}
            <span className="text-sm font-normal text-charcoal/60 ml-1">
              sur {kpis?.superficieTotale ?? 0} ha
            </span>
          </p>
          <p className="text-xs text-charcoal/40 mt-1">YieldCalculator actif</p>
        </div>
      </div>

      {showAddParcelle && (
        <AddParcelleModal
          onClose={() => setShowAddParcelle(false)}
          onSuccess={handleParcelleAdded}
        />
      )}

      {showAddVigne && (
        <AddVigneModal
          parcelles={parcelles}
          onClose={() => setShowAddVigne(false)}
          onSuccess={() => void handleVigneAdded()}
        />
      )}
    </div>
  )
}