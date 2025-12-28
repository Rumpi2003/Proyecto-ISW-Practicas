import { useAuth } from '../context/AuthContext';
import { logout } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getMyProfile } from '../services/user.service'; 
import { getCarreras } from '../services/carrera.service';
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
      const userData = response.data?.userData || response.data?.userData || response.data;
      
            // Si el perfil contiene solo el id de la carrera, resolverla desde el servicio
            let finalProfile = userData;
            try {
                const carreraId = userData?.carrera?.id ?? userData?.carrera ?? userData?.carreraId ?? null;
                if (carreraId && typeof userData.carrera !== 'object') {
                    const carreras = await getCarreras();
                    const found = (Array.isArray(carreras) ? carreras : []).find(c => String(c.id) === String(carreraId));
                    if (found) finalProfile = { ...userData, carrera: found };
                }
            } catch (err) {
                console.warn('No se pudo resolver la carrera desde el servicio:', err);
            }

            setProfileData(finalProfile);
      
      Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      }).fire({
        icon: 'success',
        title: 'Datos actualizados'
      });
    } catch (error) {
      console.error(error);
      // COMBINACIÓN: Limpiamos datos Y mostramos error
      setProfileData(null);
      Swal.fire('Error', 'No se pudo cargar el perfil', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Aumenté el ancho máximo a max-w-7xl para que quepan las 3 columnas */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-7xl min-h-[70vh] p-8 md:p-12 flex flex-col">
        
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
                className="mt-4 md:mt-0 bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2 rounded-xl font-bold transition-all text-sm border border-red-100"
            >
                Cerrar Sesión
            </button>
        </div>

        {/* ACCIONES - AHORA SON 3 COLUMNAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. MI INFORMACIÓN (Diseño elegante de MAIN) */}
            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 hover:shadow-lg transition-shadow flex flex-col">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">👤 Mi Información</h3>
                <p className="text-indigo-700 mb-6 text-sm">Consulta tus datos académicos y personales.</p>
                
                {/* Botón inicial */}
                {!profileData && (
                    <button 
                        onClick={handleGetProfile}
                        className="mt-auto bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors w-full shadow-md"
                    >
                        Ver Mis Datos
                    </button>
                )}

                {/* FICHA TÉCNICA */}
                {profileData && (
                    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden animate-fade-in-up">
                        <div className="bg-indigo-600 px-4 py-2 flex justify-between items-center">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Ficha Estudiante</span>
                            <button onClick={() => setProfileData(null)} className="text-indigo-200 hover:text-white text-lg leading-none">&times;</button>
                        </div>
                        
                        <div className="p-4 space-y-3">
                            {/* Nombre */}
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                                <div className="bg-indigo-50 p-2 rounded-lg text-lg">📛</div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre Completo</p>
                                    <p className="text-gray-800 font-bold text-sm">{profileData.nombre || 'No registrado'}</p>
                                </div>
                            </div>
                            {/* RUT */}
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                                <div className="bg-indigo-50 p-2 rounded-lg text-lg">🆔</div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">RUT</p>
                                    <p className="text-gray-800 font-medium text-sm">{profileData.rut || 'No registrado'}</p>
                                </div>
                            </div>
                            {/* Carrera */}
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                                <div className="bg-indigo-50 p-2 rounded-lg text-lg">🎓</div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Carrera</p>
                                    <p className="text-gray-800 font-medium text-sm">{profileData.carrera?.nombre || profileData.carrera || 'No registrada'}</p>
                                </div>
                            </div>
                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-50 p-2 rounded-lg text-lg">📧</div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Correo</p>
                                    <p className="text-gray-800 font-medium text-sm break-all">{profileData.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. VER OFERTAS (TU FUNCIONALIDAD - HEAD) */}
            {/* Le puse color AZUL para diferenciarlo */}
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow flex flex-col">
                <h3 className="text-xl font-bold text-blue-900 mb-2">🚀 Ofertas de Práctica</h3>
                <p className="text-blue-700 mb-4 text-sm">Explora las vacantes disponibles publicadas por los encargados.</p>
                <button 
                    onClick={() => navigate('/ofertas')}
                    className="mt-auto bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full shadow-md flex items-center justify-center gap-2"
                >
                    Ver Publicaciones
                </button>
            </div>

            {/* 3. POSTULACIONES (FUNCIONALIDAD DE MAIN) */}
            {/* Se queda en VERDE */}
            <div className="bg-green-50 p-8 rounded-2xl border border-green-100 hover:shadow-lg transition-shadow flex flex-col">
                <h3 className="text-xl font-bold text-green-900 mb-2">💼 Mis Postulaciones</h3>
                <p className="text-green-700 mb-6 text-sm">Crea nuevas solicitudes o revisa el estado de las anteriores.</p>
                <button 
                    onClick={() => navigate('/solicitudes')}
                    className="mt-auto bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors w-full shadow-md"
                >
                    Gestionar Solicitudes
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default HomeEstudiante;