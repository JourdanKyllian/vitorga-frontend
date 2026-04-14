import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Grape,
  LogOut
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Utilisateurs', icon: Users },
  { path: '/logistique/inventaire', label: 'Inventaire', icon: Package },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-forest text-cream flex flex-col">
      <div className="p-6 border-b border-forest-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
            <Grape className="w-6 h-6 text-forest" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cream">Vitorga</h1>
            <p className="text-xs text-cream/60">Gestion Viticole</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gold text-forest font-medium'
                      : 'text-cream/80 hover:bg-forest-light hover:text-cream'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-forest-light">
        <div className="flex items-center gap-3 px-4 py-3 mb-3">
          <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gold">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cream truncate">Jean Dupont</p>
            <p className="text-xs text-cream/60">Admin</p>
          </div>
        </div>
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-2 text-cream/60 hover:text-gold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Déconnexion</span>
        </NavLink>
      </div>
    </aside>
  )
}
