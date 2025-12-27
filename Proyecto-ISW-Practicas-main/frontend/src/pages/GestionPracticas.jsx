import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSolicitudes } from '../services/solicitud.service';
import Swal from 'sweetalert2';

const GestionPracticas = () => {
    const navigate = useNavigate(); // Hook para movernos entre páginas
    const [practicas, setPracticas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPracticas = async () => {
            try {
                const response = await getSolicitudes();
                // Filtramos las aprobadas (listas para evaluar)
                const aprobadas = response.data.filter(s => s.estado === 'aprobada');
                setPracticas(aprobadas);
            } catch (error) {
                console.error("Error al cargar prácticas:", error);
                Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchPracticas();
    }, []);

    // Función simplificada: Solo navega al detalle
    const handleNavegarAEvaluacion = (idSolicitud) => {
        navigate(`/encargado/solicitudes/${idSolicitud}`);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
            {/* Header */}
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Evaluación de Prácticas</h1>
                    <p className="text-gray-600 font-medium">
                        Gestión de calificaciones para alumnos con práctica en curso.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    Volver al Inicio
                </button>
            </header>

            {/* Tabla de Resultados */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Alumno</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Carrera</th>
                            <th className="p-4 font-bold text-center text-gray-500 uppercase text-xs tracking-wider">Nota Supervisor</th>
                            <th className="p-4 font-bold text-center text-gray-500 uppercase text-xs tracking-wider">Nota Encargado</th>
                            <th className="p-4 font-bold text-center text-gray-500 uppercase text-xs tracking-wider">Promedio</th>
                            <th className="p-4 font-bold text-right text-gray-500 uppercase text-xs tracking-wider">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center">Cargando...</td></tr>
                        ) : practicas.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center italic text-gray-400">No hay alumnos pendientes de evaluación.</td></tr>
                        ) : (
                            practicas.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    {/* COLUMNA: ALUMNO */}
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900">{p.estudiante?.nombre || 'Desconocido'}</div>
                                        <div className="text-xs text-gray-500">{p.estudiante?.rut}</div>
                                    </td>

                                    {/* COLUMNA: CARRERA */}
                                    <td className="p-4 text-sm text-gray-600">
                                        {p.estudiante?.carrera || 'Ingeniería Civil Informática'}
                                    </td>

                                    {/* COLUMNA: NOTA SUPERVISOR */}
                                    <td className="p-4 text-center">
                                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold text-xs">
                                            {p.evaluacion?.notaSupervisor || 'Pendiente'}
                                        </span>
                                    </td>

                                    {/* COLUMNA: NOTA ENCARGADO */}
                                    <td className="p-4 text-center">
                                        {p.evaluacion?.notaEncargado ? (
                                            <span className="text-indigo-700 font-bold">{p.evaluacion.notaEncargado}</span>
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">Sin calificar</span>
                                        )}
                                    </td>

                                    {/* COLUMNA: NOTA FINAL */}
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full font-bold text-sm ${p.evaluacion?.notaFinal >= 4.0 ? 'bg-blue-100 text-blue-800' :
                                                p.evaluacion?.notaFinal ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {p.evaluacion?.notaFinal || '-'}
                                        </span>
                                    </td>

                                    {/* COLUMNA: BOTÓN DE ACCIÓN */}
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleNavegarAEvaluacion(p.id)}
                                            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 ml-auto"
                                        >
                                            <span>📝</span> Gestionar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionPracticas;