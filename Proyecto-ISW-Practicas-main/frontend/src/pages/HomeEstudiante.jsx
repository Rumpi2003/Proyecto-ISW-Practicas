import { useAuth } from '@context/AuthContext';
import { logout } from '@services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getMyProfile } from '@services/user.service';
import { createSolicitud } from '@services/solicitud.service';
import Swal from 'sweetalert2';

const HomeEstudiante = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    
    // Estados locales
    const [profileData, setProfileData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    // Intentamos recuperar el usuario del contexto, y si no está, del storage
    const currentUser = user || JSON.parse(sessionStorage.getItem('usuario'));

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
            Swal.fire('Error', 'No se pudieron obtener los datos del perfil', 'error');
        }
    };

    const handlePostular = async (e) => {
        e.preventDefault();
        
        // Verificación de seguridad para el ID
        if (!currentUser?.id) {
            Swal.fire('Sesión expirada', 'Por favor, inicia sesión nuevamente.', 'warning');
            return;
        }

        setLoading(true);
        try {
            await createSolicitud({
                idEstudiante: currentUser.id,
                mensaje: mensaje
            });

            Swal.fire({
                title: '¡Éxito!',
                text: 'Tu solicitud ha sido enviada al encargado.',
                icon: 'success',
                confirmButtonColor: '#4f46e5'
            });
            
            setMensaje("");
            setShowForm(false);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            Swal.fire('Error', 'No se pudo enviar la solicitud: ' + errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl min-h-[70vh] p-8 md:p-12 flex flex-col">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Mi Portal Estudiantil</h1>
                        <p className="text-gray-500">
                            Bienvenido, <span className="text-indigo-600 font-semibold">{currentUser?.nombre || 'Estudiante'}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 md:mt-0 bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2 rounded-xl font-bold transition-all text-sm"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {/* ACCIONES PRINCIPALES */}
                {!showForm ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {/* BLOQUE INFORMACIÓN */}
                        <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
                            <h3 className="text-xl font-bold text-indigo-900 mb-2">Mi Información</h3>
                            <p className="text-indigo-700 mb-4 text-sm">Consulta tus datos personales registrados.</p>
                            <button onClick={handleGetProfile} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 w-full transition-all">
                                Ver Mis Datos
                            </button>
                            {profileData && (
                                <div className="mt-4 bg-white p-4 rounded-lg text-xs border border-gray-200 overflow-auto max-h-32 shadow-inner">
                                    <pre>{JSON.stringify(profileData, null, 2)}</pre>
                                </div>
                            )}
                        </div>

                        {/* BLOQUE POSTULACIÓN */}
                        <div className="bg-green-50 p-8 rounded-2xl border border-green-100">
                            <h3 className="text-xl font-bold text-green-900 mb-2">Postular a Práctica</h3>
                            <p className="text-green-700 mb-4 text-sm">Inicia tu proceso de validación de práctica.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full transition-all"
                            >
                                Crear Solicitud
                            </button>
                        </div>
                    </div>
                ) : (
                    /* FORMULARIO DE SOLICITUD */
                    <div className="animate-slide-up">
                        <button 
                            onClick={() => setShowForm(false)} 
                            className="text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-2 font-medium transition-colors"
                        >
                            ← Volver al menú
                        </button>
                        <form onSubmit={handlePostular} className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-inner">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Nueva Solicitud</h3>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Mensaje para el Encargado</label>
                                <textarea
                                    required
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    className="w-full p-4 rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-40 resize-none shadow-sm"
                                    placeholder="Describe brevemente tu solicitud de práctica (empresa, cargo, fecha de inicio)..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all text-white
                                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
                            >
                                {loading ? 'Enviando...' : '🚀 Enviar Postulación'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeEstudiante;