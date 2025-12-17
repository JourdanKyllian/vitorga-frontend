import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react'; // Petite icône sympa

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Bienvenue sur Vitorga
      </h1>
      
      <p className="text-lg text-gray-600 max-w-md mb-8">
        L'application de gestion simplifiée. Connecte-toi pour accéder à ton espace.
      </p>

      {/* Le bouton qui redirige */}
      <button
        onClick={() => navigate('/register')}
        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-transform active:scale-95 shadow-lg"
      >
        <LogIn className="w-5 h-5" />
        Se connecter
      </button>
    </div>
  );
}