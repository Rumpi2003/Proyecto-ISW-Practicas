import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('usuario');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const token = cookies.get('jwt-auth');
    const storedUser = sessionStorage.getItem('usuario');
    
    // Si tenemos datos, validamos que el token no haya expirado
    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          const userData = JSON.parse(storedUser);
          const userRole = decoded.rol || decoded.role || decoded.tipo_usuario;

          // Actualizamos el estado para asegurar que esté sincronizado
          setUser({ 
            ...userData, 
            rol: userRole
          });
        } else {
          // Token expirado: Limpiamos todo
          cookies.remove('jwt-auth');
          sessionStorage.removeItem('usuario');
          setUser(null);
        }
      } catch (error) {
        console.error('Error al decodificar token:', error);
        cookies.remove('jwt-auth');
        sessionStorage.removeItem('usuario');
        setUser(null);
      }
    } else {
       // Si no hay token, aseguramos que el usuario sea null
       // (Por si alguien borró las cookies manualmente)
       if (!token) setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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