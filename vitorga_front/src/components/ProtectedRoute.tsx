import { Navigate } from 'react-router-dom';
import { clearAuth, isTokenValid } from '../lib/auth-session';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isTokenValid()) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
