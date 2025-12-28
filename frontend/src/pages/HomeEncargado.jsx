import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { logout } from '@services/auth.service';
import { useNavigate } from 'react-router-dom';
import { getPendientes } from '@services/evaluacionEncargado.service';

const HomeEncargado = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // Estados: Uno para la lista de alumnos y otro para saber si está cargando
    const [pendientes, setPendientes] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect: Se ejecuta apenas entras a la pantalla
    // Aquí vamos a buscar al backend la lista de alumnos que faltan por evaluar
    useEffect(() => {
        const cargarPendientes = async () => {
            try {
                const response = await getPendientes();
                // Guardamos la lista en el estado (manejamos si viene en .data o directo)
                setPendientes(response.data || response);
            } catch (error) {
                console.error("Error al cargar pendientes:", error);
            } finally {
                // Sea éxito o error, quitamos el "Cargando..."
                setLoading(false);
            }
        };
        cargarPendientes();
    }, []);

    // Función para salir del sistema
    const handleLogout = () => {
        logout();
        setUser(null);
        navigate('/auth');
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* --- SECCIÓN 1: HEADER (Bienvenida y Logout) --- */}
                <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">Panel de Gestión</h1>
                        <p className="text-gray-500 mt-2">
                            Bienvenido, <span className="text-blue-600 font-bold">{user?.nombre || "Encargado"}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 md:mt-0 bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2 rounded-xl font-bold transition border border-red-100"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {/* --- SECCIÓN 2: ACCIONES RÁPIDAS (Menú de Tarjetas) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Botón: Usuarios */}
                    <div onClick={() => navigate('/dashboard/users')} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border-l-4 border-indigo-500">
                        <div className="text-3xl mb-2">👥</div>
                        <h3 className="font-bold text-gray-800">Usuarios</h3>
                        <p className="text-xs text-gray-500">Gestionar cuentas</p>
                    </div>

                    {/* Botón: Ofertas */}
                    <div onClick={() => navigate('/ofertas')} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border-l-4 border-blue-500">
                        <div className="text-3xl mb-2">📋</div>
                        <h3 className="font-bold text-gray-800">Ofertas</h3>
                        <p className="text-xs text-gray-500">Publicar prácticas</p>
                    </div>

                    {/* Botón: Pautas */}
                    <div onClick={() => navigate('/dashboard/pautas')} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border-l-4 border-emerald-500">
                        <div className="text-3xl mb-2">📝</div>
                        <h3 className="font-bold text-gray-800">Pautas</h3>
                        <p className="text-xs text-gray-500">Configurar rúbricas</p>
                    </div>

                    {/* Botón: Evaluaciones Supervisor */}
                    <div onClick={() => navigate('/dashboard/evaluaciones/gestionar')} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border-l-4 border-teal-500">
                        <div className="text-3xl mb-2">🧾</div>
                        <h3 className="font-bold text-gray-800">Supervisores</h3>
                        <p className="text-xs text-gray-500">Ver ext. evaluaciones</p>
                    </div>
                </div>

                {/* --- SECCIÓN 3: TABLA DE PENDIENTES (Lo nuevo) --- */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Encabezado de la tabla */}
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-900">📌 Prácticas Pendientes</h2>
                            <p className="text-indigo-600 text-sm">Alumnos que esperan tu nota final.</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                            <span className="font-bold text-indigo-600">{pendientes.length}</span> Pendientes
                        </div>
                    </div>

                    {/* Cuerpo de la tabla */}
                    <div className="p-6">
                        {loading ? (
                            <p className="text-center text-gray-500 py-10">Cargando datos...</p>
                        ) : pendientes.length === 0 ? (
                            // Mensaje si no hay nada pendiente
                            <div className="text-center py-10 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">🎉 ¡Todo al día! No hay evaluaciones pendientes.</p>
                            </div>
                        ) : (
                            // Tabla con datos
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-gray-500 text-sm border-b">
                                            <th className="py-3 px-4 font-medium">Estudiante</th>
                                            <th className="py-3 px-4 font-medium">Rut</th>
                                            <th className="py-3 px-4 font-medium">Fecha Entrega</th>
                                            <th className="py-3 px-4 font-medium text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pendientes.map((solicitud) => (
                                            <tr key={solicitud.id} className="hover:bg-gray-50 transition">
                                                <td className="py-4 px-4 font-semibold text-gray-800">
                                                    {solicitud.estudiante?.nombre || "Estudiante"}
                                                </td>
                                                <td className="py-4 px-4 text-gray-600">
                                                    {solicitud.estudiante?.rut || "-"}
                                                </td>
                                                <td className="py-4 px-4 text-gray-500 text-sm">
                                                    {new Date(solicitud.updatedAt || Date.now()).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    {/* Botón que lleva a la página de evaluar */}
                                                    <button
                                                        onClick={() => navigate(`/encargado/evaluar/${solicitud.id}`)}
                                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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
                </div>

            </div>
        </div>
    );
};

export default HomeEncargado;