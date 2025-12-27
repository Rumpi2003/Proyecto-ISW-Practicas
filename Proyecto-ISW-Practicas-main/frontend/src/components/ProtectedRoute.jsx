import { Navigate } from 'react-router-dom';

/**
 * Componente de Protección de Rutas
 * Verifica si existe un usuario en el sessionStorage antes de permitir el acceso.
 */
const ProtectedRoute = ({ children }) => {
    // Obtenemos el usuario del almacenamiento de sesión
    const user = JSON.parse(sessionStorage.getItem('usuario'));

    // Si no hay usuario, redirigimos al login de forma inmediata
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Si el usuario existe, permitimos que vea el contenido de la ruta (children)
    return children;
};

export default ProtectedRoute;