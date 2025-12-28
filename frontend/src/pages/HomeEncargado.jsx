// src/pages/HomeEncargado.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { logout } from '@services/auth.service';
import { useNavigate } from 'react-router-dom';
import { getPendientes } from '@services/evaluacionEncargado.service';

const HomeEncargado = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // Estados para la lista de alumnos y el indicador de carga
    const [pendientes, setPendientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPendientes = async () => {
            try {
                const response = await getPendientes();
                // Manejamos la estructura del responseHandler (data o directo)
                const data = response.data || response;
                setPendientes(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al cargar pendientes:", error);
                setPendientes([]);
            } finally {
                setLoading(false);
            }
        };
        cargarPendientes();
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        navigate('/auth');
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* --- SECCIÓN 1: HEADER --- */}
                <header className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row justify-between items-center border border-gray-100">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Panel de Gestión</h1>
                        <p className="text-gray-500 mt-1">
                            Bienvenido, <span className="text-indigo-600 font-bold">{user?.nombre || "Encargado"}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 md:mt-0 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 border border-red-100 shadow-sm"
                    >
                        Cerrar Sesión
                    </button>
                </header>

                {/* --- SECCIÓN 2: ACCIONES RÁPIDAS --- */}
                <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Usuarios */}
                    <div onClick={() => navigate('/dashboard/users')} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-indigo-500 group">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
                        <h3 className="font-bold text-gray-800">Usuarios</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Gestionar cuentas</p>
                    </div>

                    {/* Ofertas */}
                    <div onClick={() => navigate('/ofertas')} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-500 group">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
                        <h3 className="font-bold text-gray-800">Ofertas</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Publicar prácticas</p>
                    </div>

                    {/* Pautas */}
                    <div onClick={() => navigate('/dashboard/pautas')} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-emerald-500 group">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📝</div>
                        <h3 className="font-bold text-gray-800">Pautas</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Configurar rúbricas</p>
                    </div>

                    {/* Supervisores */}
                    <div onClick={() => navigate('/dashboard/evaluaciones/gestionar')} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-teal-500 group">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🧾</div>
                        <h3 className="font-bold text-gray-800">Supervisores</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Ver evaluaciones</p>
                    </div>
                </nav>

                {/* --- SECCIÓN 3: TABLA DE PENDIENTES --- */}
                <section className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header de la tabla */}
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                                <span>📌</span> Prácticas Pendientes
                            </h2>
                            <p className="text-indigo-600 text-sm mt-1">Gestión de calificaciones y promedios finales.</p>
                        </div>
                        <div className="bg-white px-5 py-2 rounded-full shadow-sm border border-indigo-100">
                            <span className="font-bold text-indigo-600">{pendientes.length}</span> Solicitudes
                        </div>
                    </div>

                    {/* Contenido Dinámico */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <p className="text-gray-500 mt-4 font-medium">Sincronizando con el servidor...</p>
                            </div>
                        ) : pendientes.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-4xl mb-3">🎉</p>
                                <p className="text-gray-600 text-lg font-medium">¡Todo al día! No hay evaluaciones por procesar.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-gray-400 text-xs uppercase tracking-widest border-b bg-gray-50/50">
                                            <th className="py-4 px-6 font-bold">Estudiante</th>
                                            <th className="py-4 px-6 font-bold">Rut</th>
                                            <th className="py-4 px-6 font-bold">Última Actualización</th>
                                            <th className="py-4 px-6 font-bold text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pendientes.map((solicitud) => (
                                            <tr key={solicitud.id} className="hover:bg-indigo-50/30 transition-colors group">
                                                <td className="py-5 px-6 font-bold text-gray-800">
                                                    {solicitud.estudiante?.nombre || "Estudiante no identificado"}
                                                </td>
                                                <td className="py-5 px-6 text-gray-600 font-mono text-sm">
                                                    {solicitud.estudiante?.rut || "S/R"}
                                                </td>
                                                <td className="py-5 px-6 text-gray-500 text-sm">
                                                    {new Date(solicitud.updatedAt || Date.now()).toLocaleDateString('es-CL', {
                                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <button
                                                        onClick={() => navigate(`/encargado/evaluar/${solicitud.id}`)}
                                                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 active:scale-95"
                                                    >
                                                        Evaluar ➜
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomeEncargado;