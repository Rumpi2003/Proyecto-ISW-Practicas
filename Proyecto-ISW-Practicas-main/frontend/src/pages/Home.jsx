import { useAuth } from '@context/AuthContext';
import HomeEncargado from './HomeEncargado';
import HomeEstudiante from './HomeEstudiante';
import HomeSupervisor from './HomeSupervisor';

const Home = () => {
  const { user } = useAuth();
  
  // Recuperación de sesión persistente (Storage Fallback)
  const userStorage = JSON.parse(sessionStorage.getItem('usuario') || 'null');
  const currentUser = user || userStorage;

  // Renderizado condicional basado en Roles
  if (currentUser?.rol === 'encargado') {
    return <HomeEncargado />;
  }

  if (currentUser?.rol === 'estudiante') {
    return <HomeEstudiante />;
  }

  if (currentUser?.rol === 'supervisor') {
    return <HomeSupervisor />;
  }

  // Vista de error por defecto (Sin permisos o Rol no identificado)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full border border-gray-100">
            <div className="mb-4 text-red-500">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Acceso Restringido</h1>
            <p className="text-gray-600 mb-6 text-sm">
                No hemos podido verificar tu perfil de usuario. Por favor, inicia sesión nuevamente para acceder al panel.
            </p>
            
            <button 
                onClick={() => {
                    sessionStorage.clear();
                    window.location.href = '/';
                }}
                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
                Volver al Inicio
            </button>
        </div>
    </div>
  );
};

export default Home;