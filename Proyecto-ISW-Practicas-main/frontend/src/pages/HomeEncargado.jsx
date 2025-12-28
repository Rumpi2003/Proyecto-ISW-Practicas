import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { getSolicitudes } from '../services/solicitud.service';

const HomeEncargado = () => {
    const navigate = useNavigate();
    const [pendientes, setPendientes] = useState(0);
    const user = JSON.parse(sessionStorage.getItem('usuario') || '{}');

    useEffect(() => {
        const fetchContador = async () => {
            try {
                const response = await getSolicitudes();
                const soloPendientes = response.data.filter(s => s.estado === 'espera');
                setPendientes(soloPendientes.length);
            } catch (error) {
                console.error("Error al cargar contador:", error);
            }
        };
        fetchContador();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Portal del Encargado</h1>
                    <p className="text-gray-500 font-medium">Bienvenido, {user.nombre || "Usuario"}</p>
                </div>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-200 transition-all text-sm">
                    Cerrar Sesión
                </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Gestión de Supervisores */}
                <div
                    onClick={() => navigate('/dashboard/users')}
                    className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer transform hover:-translate-y-1"
                >
                    <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:bg-blue-600 transition-colors">
                        👥
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión de Supervisores</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Crear nuevas cuentas para empresas y eliminar supervisores del sistema.
                    </p>
                </div>
                {/* Revisar Solicitudes y Documentos */}
                <div
                    onClick={() => navigate('/encargado/solicitudes')}
                    className="relative group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer transform hover:-translate-y-1"
                >
                    {/* Badge del contador dinámico */}
                    {pendientes > 0 && (
                        <div className="absolute -top-3 -right-3 bg-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-black shadow-lg border-4 border-white animate-pulse">
                            {pendientes}
                        </div>
                    )}
                    <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:bg-orange-600 transition-colors">
                        📄
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Solicitudes de Práctica</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Aceptar o rechazar postulaciones y revisar documentos PDF subidos por alumnos.
                    </p>
                </div>
                {/* Evaluación y Promedio Final */}
                <div
                    onClick={() => navigate('/encargado/practicas')}
                    className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all cursor-pointer transform hover:-translate-y-1"
                >
                    <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:bg-purple-600 transition-colors">
                        🎓
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Evaluación y Notas</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Ingresar nota de encargado, visualizar nota de supervisor y calcular promedio final.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomeEncargado;