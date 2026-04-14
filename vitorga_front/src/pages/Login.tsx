import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grape, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-forest relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center">
              <Grape className="w-10 h-10 text-forest" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-cream">Vitorga</h1>
              <p className="text-cream/60">Gestion Viticole</p>
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-cream mb-4">
            Gérez votre vignoble avec précision
          </h2>
          <p className="text-cream/70 text-lg max-w-md">
            Suivez vos parcelles, optimisez vos rendements et anticipez les risques 
            grâce à une plateforme complète de gestion viticole.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gold">250+</p>
              <p className="text-sm text-cream/60">Domaines</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gold">15k</p>
              <p className="text-sm text-cream/60">Hectares</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gold">98%</p>
              <p className="text-sm text-cream/60">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
              <Grape className="w-7 h-7 text-forest" />
            </div>
            <h1 className="text-2xl font-bold text-forest">Vitorga</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-charcoal">Connexion</h2>
            <p className="text-charcoal/60 mt-2">
              Accédez à votre espace de gestion
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@domaine.fr"
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white border-2 border-cream-dark rounded-xl focus:outline-none focus:border-forest transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-forest rounded" />
                <span className="text-sm text-charcoal/70">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-forest font-medium hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gold hover:bg-gold-dark text-forest font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-charcoal/60">
            Pas encore de compte ?{' '}
            <a href="#" className="text-forest font-medium hover:underline">
              Contactez-nous
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
