import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'warning' | 'danger'
}

export default function KPICard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend,
  variant = 'default' 
}: KPICardProps) {
  const variantStyles = {
    default: 'bg-white border-cream-dark',
    warning: 'bg-gold/10 border-gold',
    danger: 'bg-red-50 border-red-200',
  }

  return (
    <div className={`rounded-xl border-2 p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal/60 font-medium">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-charcoal">{value}</span>
            {unit && <span className="text-lg text-charcoal/60">{unit}</span>}
          </div>
          {trend && (
            <p className={`mt-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% vs mois dernier
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-forest/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-forest" />
        </div>
      </div>
    </div>
  )
}
