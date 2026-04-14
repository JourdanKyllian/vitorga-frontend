import { useState } from 'react'
import { 
  Thermometer, 
  Droplets, 
  MapPin, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import KPICard from '../components/KPICard'
import ChartCard from '../components/ChartCard'

const parcelles = [
  { id: 'all', name: 'Toutes les parcelles' },
  { id: 'p1', name: 'Parcelle Nord - Chardonnay' },
  { id: 'p2', name: 'Parcelle Sud - Pinot Noir' },
  { id: 'p3', name: 'Parcelle Est - Merlot' },
  { id: 'p4', name: 'Parcelle Ouest - Cabernet' },
]

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

const rendementData = [
  { parcelle: 'Nord', rendement: 8500, objectif: 9000 },
  { parcelle: 'Sud', rendement: 7200, objectif: 7500 },
  { parcelle: 'Est', rendement: 9100, objectif: 8500 },
  { parcelle: 'Ouest', rendement: 6800, objectif: 7000 },
]

const kpiData = {
  all: { temp: 18, humidity: 52, superficie: 45, risque: 'Faible' },
  p1: { temp: 17, humidity: 55, superficie: 12, risque: 'Faible' },
  p2: { temp: 19, humidity: 48, superficie: 15, risque: 'Modéré' },
  p3: { temp: 18, humidity: 50, superficie: 10, risque: 'Faible' },
  p4: { temp: 20, humidity: 58, superficie: 8, risque: 'Élevé' },
}

export default function Dashboard() {
  const [selectedParcelle, setSelectedParcelle] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentKPI = kpiData[selectedParcelle as keyof typeof kpiData]
  const selectedParcelleName = parcelles.find(p => p.id === selectedParcelle)?.name

  const getRisqueVariant = (risque: string) => {
    switch (risque) {
      case 'Élevé': return 'danger'
      case 'Modéré': return 'warning'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Tableau de bord</h1>
          <p className="text-charcoal/60 mt-1">Vue d&apos;ensemble de votre exploitation</p>
        </div>

        {/* Parcelle Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-cream-dark rounded-xl hover:border-forest/30 transition-colors min-w-[280px]"
          >
            <MapPin className="w-5 h-5 text-forest" />
            <span className="flex-1 text-left text-charcoal font-medium">
              {selectedParcelleName}
            </span>
            <ChevronDown className={`w-5 h-5 text-charcoal/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-cream-dark rounded-xl shadow-lg overflow-hidden z-10">
              {parcelles.map((parcelle) => (
                <button
                  key={parcelle.id}
                  onClick={() => {
                    setSelectedParcelle(parcelle.id)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-cream transition-colors ${
                    selectedParcelle === parcelle.id ? 'bg-forest/5 text-forest font-medium' : 'text-charcoal'
                  }`}
                >
                  {parcelle.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Température moyenne"
          value={currentKPI.temp}
          unit="°C"
          icon={Thermometer}
          trend={{ value: 2.5, isPositive: true }}
        />
        <KPICard
          title="Humidité"
          value={currentKPI.humidity}
          unit="%"
          icon={Droplets}
          trend={{ value: 5, isPositive: false }}
        />
        <KPICard
          title="Superficie"
          value={currentKPI.superficie}
          unit="ha"
          icon={MapPin}
        />
        <KPICard
          title="Risque Maladie"
          value={currentKPI.risque}
          icon={AlertTriangle}
          variant={getRisqueVariant(currentKPI.risque)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Climate Evolution Chart */}
        <ChartCard title="Évolution climatique annuelle">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={climatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e6" />
                <XAxis 
                  dataKey="mois" 
                  tick={{ fill: '#1a1a1a', fontSize: 12 }}
                  axisLine={{ stroke: '#f5f0e6' }}
                />
                <YAxis 
                  yAxisId="temp"
                  tick={{ fill: '#1a1a1a', fontSize: 12 }}
                  axisLine={{ stroke: '#f5f0e6' }}
                  label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#1a1a1a' }}
                />
                <YAxis 
                  yAxisId="humidity"
                  orientation="right"
                  tick={{ fill: '#1a1a1a', fontSize: 12 }}
                  axisLine={{ stroke: '#f5f0e6' }}
                  label={{ value: '%', angle: 90, position: 'insideRight', fill: '#1a1a1a' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #f5f0e6',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  name="Température"
                  stroke="#dcab24"
                  strokeWidth={3}
                  dot={{ fill: '#dcab24', strokeWidth: 2 }}
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidite"
                  name="Humidité"
                  stroke="#023226"
                  strokeWidth={3}
                  dot={{ fill: '#023226', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Yield by Parcelle Chart */}
        <ChartCard title="Rendements par parcelle (kg/ha)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rendementData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e6" />
                <XAxis 
                  dataKey="parcelle" 
                  tick={{ fill: '#1a1a1a', fontSize: 12 }}
                  axisLine={{ stroke: '#f5f0e6' }}
                />
                <YAxis 
                  tick={{ fill: '#1a1a1a', fontSize: 12 }}
                  axisLine={{ stroke: '#f5f0e6' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #f5f0e6',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="rendement" 
                  name="Rendement actuel"
                  fill="#023226" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="objectif" 
                  name="Objectif"
                  fill="#dcab24" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
