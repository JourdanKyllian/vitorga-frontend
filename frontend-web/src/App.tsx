import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <-- Import

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* La Navbar est en dehors des Routes, elle est donc toujours visible */}

      {/* Le contenu change ici */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* <-- Nouvelle Route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;