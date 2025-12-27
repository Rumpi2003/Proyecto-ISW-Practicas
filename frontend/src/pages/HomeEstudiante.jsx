import { useAuth } from '../context/AuthContext';
import { logout } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getMyProfile } from '../services/user.service'; // Ajusta la ruta si es necesario
import Swal from 'sweetalert2';

const HomeEstudiante = () => {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  const handleLogout = () => {
    logout(); 
    setUser(null);
    navigate('/auth');
  };

  const handleGetProfile = async () => {
    try {
      const response = await getMyProfile();
      setProfileData(response.data);
      Swal.fire({
          title: 'Datos Obtenidos',
          text: 'Revisa la sección inferior para ver tus datos.',
          icon: 'success',
          timer: 2000
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cargar el perfil', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl min-h-[70vh] p-8 md:p-12 flex flex-col">
        
        {/* HEADER ESTUDIANTE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6">
            <div>
                <img 
                    src="/logo_universidad.png" 
                    alt="Logo UBB" 
                    className="h-12 mb-3 object-contain" 
                />
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                    Mi Portal
                </h1>
                <p className="text-gray-500">
                    Bienvenido, Estudiante <span className="text-indigo-600 font-semibold">{user?.nombre}</span>
                </p>
            </div>
            <button 
                onClick={handleLogout} 
                className="mt-4 md:mt-0 bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2 rounded-xl font-bold transition-all text-sm"
            >
                Salir
            </button>
        </div>

        {/* ACCIONES DEL ESTUDIANTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* TARJETA 1: DATOS PERSONALES */}
            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">👤 Mi Información</h3>
                <p className="text-indigo-700 mb-4 text-sm">Consulta tus datos personales registrados.</p>
                <button 
                    onClick={handleGetProfile}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full shadow-sm"
                >
                    Ver Mis Datos
                </button>
                {profileData && (
                    <div className="mt-4 bg-white p-4 rounded-lg text-xs overflow-auto max-h-40 border border-gray-200 shadow-inner">
                        <pre>{JSON.stringify(profileData, null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* TARJETA 2: VER OFERTAS (Funcionalidad Agregada) */}
            <div className="bg-green-50 p-8 rounded-2xl border border-green-100 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-green-900 mb-2">🚀 Ofertas de Práctica</h3>
                <p className="text-green-700 mb-4 text-sm">Explora las vacantes disponibles publicadas por los encargados.</p>
                <button 
                    onClick={() => navigate('/ofertas')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full shadow-sm flex items-center justify-center gap-2"
                >
                    Ver Publicaciones
                </button>
            </div>

        </div>

      </div>
    </div>
  );
};

export default HomeEstudiante;