import { useAuth } from '@context/AuthContext';
import { logout } from '@services/auth.service';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const HomeSupervisor = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setUser(null);
        navigate('/auth');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl min-h-[70vh] p-8 md:p-12 flex flex-col">

                {/* HEADER SUPERVISOR */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <img
                            src="/logo_universidad.png"
                            alt="Logo UBB"
                            className="h-12 mb-3 object-contain"
                        />
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                            Portal de Supervisión
                        </h1>
                        <p className="text-gray-500">
                            Bienvenido, Supervisor <span className="text-purple-600 font-semibold">{user?.nombre}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 md:mt-0 bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2 rounded-xl font-bold transition-all text-sm border border-red-100"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="flex flex-col items-center justify-center flex-grow bg-purple-50 rounded-2xl border-2 border-dashed border-purple-200 p-10">
                    <div className="text-6xl mb-4">🚧</div>
                    <h2 className="text-2xl font-bold text-purple-900 mb-2">Módulo en Desarrollo</h2>
                    <p className="text-purple-600 text-center max-w-md">
                        Estamos preparando las herramientas para que puedas evaluar y supervisar las prácticas.
                    </p>

                    <button
                        onClick={() => Swal.fire('Información', 'Aquí verás la lista de alumnos a tu cargo.', 'info')}
                        className="mt-8 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Ver Demo de Alerta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeSupervisor;