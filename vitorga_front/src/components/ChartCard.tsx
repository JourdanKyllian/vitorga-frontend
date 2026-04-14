import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  children: ReactNode
  action?: ReactNode
}

export default function ChartCard({ title, children, action }: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-cream-dark p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}
