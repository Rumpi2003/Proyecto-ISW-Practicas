import { useAuth } from '@context/AuthContext';
import { logout } from '@services/auth.service';
import { useNavigate } from 'react-router-dom';

const HomeEncargado = () => {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    setUser(null);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl min-h-[80vh] p-8 md:p-12 flex flex-col">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-100 pb-6">
            <div>
                <img 
                    src="/logo_universidad.png" 
                    alt="Logo UBB" 
                    className="h-14 mb-4 object-contain" 
                />
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
                    Panel de Gestión
                </h1>
                <p className="text-gray-500 text-lg">
                    Hola, <span className="text-blue-600 font-semibold">{user?.nombre || user?.email}</span> (Encargado)
                </p>
            </div>
            <button 
                onClick={handleLogout} 
                className="mt-4 md:mt-0 bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm border border-red-100"
            >
                Cerrar Sesión
            </button>
        </div>

        {/* MENU PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div 
                onClick={() => navigate('/dashboard/users')}
                className="group bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-10 cursor-pointer hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-2xl transition-all duration-300 flex items-center gap-6"
            >
                <div className="bg-white p-4 rounded-full text-4xl shadow-sm group-hover:scale-110 transition-transform">
                    👥
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors">
                        Administrar Usuarios
                    </h3>
                    <p className="text-gray-500 mt-1 group-hover:text-indigo-100 transition-colors">
                        Crear, editar y eliminar cuentas.
                    </p>
                </div>
            </div>

            <div className="group bg-gray-50 border-2 border-gray-100 rounded-2xl p-10 cursor-not-allowed opacity-70 flex items-center gap-6">
                <div className="bg-white p-4 rounded-full text-4xl shadow-sm grayscale">
                    📄
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-400">
                        Gestionar Solicitudes
                    </h3>
                    <p className="text-gray-400 mt-1 text-sm">Próximamente...</p>
                </div>
            </div>

            <div 
                onClick={() => navigate('/dashboard/pautas')}
                className="group bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-10 cursor-pointer hover:bg-emerald-600 hover:border-emerald-600 hover:shadow-2xl transition-all duration-300 flex items-center gap-6"
            >
                <div className="bg-white p-4 rounded-full text-4xl shadow-sm group-hover:scale-110 transition-transform">
                    📝
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors">
                        Pautas de Evaluación
                    </h3>
                    <p className="text-gray-500 mt-1 group-hover:text-emerald-100 transition-colors">
                        Crear y gestionar pautas de evaluación.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEncargado;