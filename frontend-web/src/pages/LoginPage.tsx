import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  // États pour gérer les entrées et l'interface
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation d'un appel API (Attente de 1.5 seconde)
    setTimeout(() => {
      // Validation simple pour l'exemple
      if (email === 'admin@vitorga.com' && password === '1234') {
        alert('Connexion réussie !');
        navigate('/'); // Redirection vers l'accueil (ou dashboard plus tard)
      } else {
        setError('Email ou mot de passe incorrect (Essaie: admin@vitorga.com / 1234)');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      {/* Carte du formulaire */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Bouton retour */}
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à l'accueil
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="text-gray-500 mt-2">Bienvenue sur Vitorga</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Champ Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="exemple@email.com"
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              {/* Bouton pour voir/cacher le mot de passe */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
}