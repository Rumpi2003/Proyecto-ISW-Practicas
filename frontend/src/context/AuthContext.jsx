import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // 1. Iniciamos cargando en true
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = cookies.get('jwt-auth');
      const storedUser = sessionStorage.getItem('usuario');

      if (token && storedUser) {
        const decoded = jwtDecode(token);
        // Verificar expiración
        if (decoded.exp * 1000 > Date.now()) {
          const userData = JSON.parse(storedUser);
          const userRole = decoded.rol || decoded.role || decoded.tipo_usuario;
          
          setUser({ ...userData, rol: userRole });
        } else {
          // Token expirado
          cookies.remove('jwt-auth');
          sessionStorage.removeItem('usuario');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error al restaurar sesión:', error);
      cookies.remove('jwt-auth');
      sessionStorage.removeItem('usuario');
      setUser(null);
    } finally {
      // 2. IMPORTANTE: Independiente de si hay usuario o error, dejamos de cargar
      setLoading(false);
    }
  }, []);

  // 3. Pasamos 'loading' al proveedor
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};