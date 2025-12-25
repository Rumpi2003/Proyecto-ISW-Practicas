import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendientes } from '../services/evaluacion.service';

const Solicitudes = () => {
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const data = await getPendientes();
                setSolicitudes(data || []);
            } catch (error) {
                console.error("Error cargando solicitudes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitudes();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                
                {/* ENCABEZADO Y BOTÓN VOLVER */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">
                            Evaluaciones Pendientes
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Listado de prácticas que ya tienen nota del supervisor.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/home-encargado')}
                        className="bg-white text-gray-600 border border-gray-300 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        ⬅ Volver al Panel
                    </button>
                </div>

                {/* TABLA DE CONTENIDO */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Cargando datos... ⏳</div>
                    ) : solicitudes.length === 0 ? (
                        <div className="p-16 text-center flex flex-col items-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-xl font-bold text-gray-800">¡Todo al día!</h3>
                            <p className="text-gray-500">No hay solicitudes pendientes de revisión.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                                        <th className="p-6 font-semibold">Estudiante</th>
                                        <th className="p-6 font-semibold">RUT</th>
                                        <th className="p-6 font-semibold">Carrera</th>
                                        <th className="p-6 font-semibold text-center">Nota Supervisor</th>
                                        <th className="p-6 font-semibold text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {solicitudes.map((solicitud) => (
                                        <tr key={solicitud.id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="p-6 font-medium text-gray-800">
                                                {solicitud.estudiante.nombre}
                                            </td>
                                            <td className="p-6 text-gray-600">
                                                {solicitud.estudiante.rut}
                                            </td>
                                            <td className="p-6 text-gray-600">
                                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                                                    {solicitud.estudiante.carrera}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center font-bold text-gray-700">
                                                {solicitud.notaSupervisor}
                                            </td>
                                            <td className="p-6 text-center">
                                                <button
                                                    onClick={() => navigate(`/encargado/solicitudes/${solicitud.id}`)}
                                                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
                                                >
                                                    Evaluar 📝
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
    );
};

export default Solicitudes;