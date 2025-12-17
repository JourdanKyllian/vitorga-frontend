import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();

  // On regroupe les données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Gestion des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 1. Validation : Mots de passe identiques ?
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    // 2. Validation : Longueur du mot de passe
    if (formData.password.length < 6) {
        setError("Le mot de passe doit faire au moins 6 caractères.");
        setIsLoading(false);
        return;
    }

    // Simulation d'inscription
    setTimeout(() => {
      alert(`Compte créé pour ${formData.prenom} ${formData.nom} !`);
      navigate('/login'); // Redirection vers la connexion après succès
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
          <p className="text-gray-500 mt-2">Rejoignez l'aventure Vitorga</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Ligne Nom / Prénom (Grid 2 colonnes) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  name="nom"
                  type="text"
                  required
                  placeholder="Dupont"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prénom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  name="prenom"
                  type="text"
                  required
                  placeholder="Jean"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="jean.dupont@exemple.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirmation Mot de passe */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
              />
            </div>
            {/* Message d'aide si ça ne match pas en direct */}
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
               <p className="text-xs text-red-500 flex items-center gap-1">
                 <AlertCircle className="w-3 h-3" /> Les mots de passe ne correspondent pas
               </p>
            )}
          </div>

          {/* Erreur globale */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}