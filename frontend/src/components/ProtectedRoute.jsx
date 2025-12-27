import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. Si está cargando, mostramos una pantalla de espera.
  // Esto evita que nos expulse al login mientras verifica la cookie.
  if (loading) {
    return <div>Cargando...</div>; 
  }

  // 2. Si terminó de cargar y NO hay usuario, entonces sí redirigimos.
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 3. Si hay usuario, renderizamos la página protegida.
  return children;
};

export default ProtectedRoute;