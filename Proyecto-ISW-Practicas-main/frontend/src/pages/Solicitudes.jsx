import { useEffect, useState } from 'react';
import { getSolicitudes, updateEstadoSolicitud } from '../services/solicitud.service';
import Swal from 'sweetalert2';

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const fetchSolicitudes = async () => {
        try {
            const response = await getSolicitudes();
            setSolicitudes(response.data || []);
        } catch (error) {
            console.error("Error al cargar solicitudes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (id, nuevoEstado) => {
        const { value: comentarios } = await Swal.fire({
            title: `¿Confirmar ${nuevoEstado}?`,
            input: 'textarea',
            inputLabel: 'Añade un comentario o retroalimentación para el alumno',
            inputPlaceholder: 'Escribe aquí...',
            showCancelButton: true,
            confirmButtonColor: nuevoEstado === 'aprobada' ? '#10b981' : '#ef4444',
        });

        if (comentarios !== undefined) {
            try {
                await updateEstadoSolicitud(id, nuevoEstado, comentarios);
                Swal.fire('Actualizado', `La solicitud ha sido ${nuevoEstado}`, 'success');
                fetchSolicitudes(); // Recargar la tabla
            } catch (error) {
                Swal.fire('Error', error.message || 'No se pudo actualizar', 'error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Solicitudes de Práctica</h1>
                    <p className="text-gray-500">Revisa y gestiona las postulaciones de los estudiantes.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-bold text-gray-600">Estudiante</th>
                                <th className="p-4 font-bold text-gray-600">Mensaje</th>
                                <th className="p-4 font-bold text-gray-600">Fecha Envío</th>
                                <th className="p-4 font-bold text-gray-600">Estado</th>
                                <th className="p-4 font-bold text-gray-600 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {solicitudes.map((soli) => (
                                <tr key={soli.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{soli.estudiante?.nombre || 'N/A'}</div>
                                        <div className="text-xs text-gray-400">{soli.estudiante?.email}</div>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm max-w-xs truncate">{soli.mensaje}</td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {new Date(soli.fechaEnvio).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold 
                    ${soli.estado === 'espera' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${soli.estado === 'aprobada' ? 'bg-green-100 text-green-700' : ''}
                    ${soli.estado === 'rechazada' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                                            {soli.estado.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        {soli.estado === 'espera' && (
                                            <>
                                                <button
                                                    onClick={() => handleCambiarEstado(soli.id, 'aprobada')}
                                                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 text-xs font-bold"
                                                >
                                                    Aprobar
                                                </button>
                                                <button
                                                    onClick={() => handleCambiarEstado(soli.id, 'rechazada')}
                                                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 text-xs font-bold"
                                                >
                                                    Rechazar
                                                </button>
                                            </>
                                        )}
                                        {soli.estado !== 'espera' && (
                                            <span className="text-gray-400 italic text-xs text-center w-full">Gestionada</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {solicitudes.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-400 italic">No hay solicitudes pendientes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Solicitudes;