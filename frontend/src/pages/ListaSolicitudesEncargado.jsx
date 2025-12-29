import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllSolicitudes, evaluarSolicitud, deleteSolicitud } from '@services/solicitud.service';
import Swal from 'sweetalert2';

const ListaSolicitudesEncargado = () => {
    const navigate = useNavigate();
    const { filtro } = useParams(); 
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    const isPendiente = filtro === 'pendientes';

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const response = await getAllSolicitudes();
                const data = Array.isArray(response) ? response : response.data || [];

                const filtradas = data.filter(soli => {
                    const estado = soli.estado ? soli.estado.toLowerCase() : '';
                    if (isPendiente) {
                        return ['pendiente', 'en revision', 'espera'].includes(estado);
                    } else {
                        return ['aprobada', 'rechazada'].includes(estado);
                    }
                });
                setSolicitudes(filtradas);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitudes();
    }, [filtro, isPendiente]);

    const handleEvaluar = (solicitud) => { 
        Swal.fire({
            title: 'Evaluar Solicitud',
            input: 'textarea',
            inputPlaceholder: 'Escribe el motivo...',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '✅ Aprobar',
            denyButtonText: '❌ Rechazar',
            returnInputValueOnDeny: true,             
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#10B981',
            denyButtonColor: '#EF4444',
            width: '600px'
        }).then(async (result) => {
            if (result.isDismissed) return;

            const comentarios = result.value || ''; 
            let nuevoEstado = '';

            if (result.isConfirmed) nuevoEstado = 'aprobada';
            else if (result.isDenied) nuevoEstado = 'rechazada';

            try {
                await evaluarSolicitud(solicitud.id, nuevoEstado, comentarios);

                setSolicitudes(prev => prev.filter(s => s.id !== solicitud.id));
                
                Swal.fire({
                    title: '¡Procesado!',
                    text: `La solicitud ha sido ${nuevoEstado}.`,
                    icon: 'success',
                    timer: 2000
                });

            } catch (error) {
                console.error("Error completo:", error);
                const msg = error.response?.data?.message || error.message || 'Error de conexión';
                Swal.fire('Error', msg, 'error');
            }
        });
    };

    const handleEliminar = (id) => {
        Swal.fire({
            title: '¿Eliminar del historial?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteSolicitud(id);
                    setSolicitudes(prev => prev.filter(s => s.id !== id));
                    Swal.fire('Eliminado', 'La solicitud ha sido eliminada.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
                }
            }
        });
    };

    return (
        <div className="min-h-screen p-8 font-sans">
            <div className="max-w-7xl mx-auto flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/dashboard/solicitudes-encargado')} 
                    className="bg-white px-4 py-2 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 shadow-sm transition-all"
                >
                    ← Volver
                </button>
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
                    {isPendiente ? '⏳ Solicitudes Por Evaluar' : '📂 Historial de Solicitudes'}
                </h1>
            </div>

            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-sky-100 text-sky-800 uppercase text-sm tracking-wider border-b border-sky-200">
                            <tr>
                                <th className="p-5 font-bold w-1/5">Estudiante</th>
                                <th className="p-5 font-bold w-2/5">Mensaje</th>
                                <th className="p-5 font-bold text-center w-1/5">Archivo</th> 
                                {isPendiente && <th className="p-5 font-bold text-center w-1/5">Evaluar</th>}
                                {!isPendiente && <th className="p-5 font-bold w-1/5">Estado</th>}
                                {!isPendiente && <th className="p-5 font-bold text-center w-20">Eliminar</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {solicitudes.length > 0 ? (
                                solicitudes.map(soli => (
                                    <tr key={soli.id} className="hover:bg-sky-50 transition-colors duration-150">
                                        <td className="p-5 font-bold capitalize text-gray-800 align-top">
                                            {soli.nombreEstudiante || soli.usuario?.nombre || 'Estudiante'}
                                            <div className="text-xs text-gray-400 font-normal mt-1">{soli.rutEstudiante || soli.usuario?.rut}</div>
                                        </td>
                                        
                                        <td className="p-5 text-sm text-gray-600 align-top whitespace-pre-wrap break-words min-w-[300px]">
                                            {soli.mensaje || 'Sin mensaje'}
                                        </td>
                                        
                                        <td className="p-5 text-center align-top">
                                            {soli.documentos && soli.documentos.length > 0 ? (
                                                <a 
                                                    href={soli.documentos[0]} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                >
                                                    📄 PDF
                                                </a>
                                            ) : <span className="text-gray-400 text-sm">-</span>}
                                        </td>

                                        {isPendiente && (
                                            <td className="p-5 text-center align-top">
                                                <button 
                                                    onClick={() => handleEvaluar(soli)}
                                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105"
                                                >
                                                    Evaluar
                                                </button>
                                            </td>
                                        )}

                                        {!isPendiente && (
                                            <>
                                                <td className="p-5 align-top">
                                                    <div className="flex flex-col items-start gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                                                            soli.estado === 'aprobada' 
                                                            ? 'bg-green-100 text-green-700 border-green-200' 
                                                            : 'bg-red-100 text-red-700 border-red-200'
                                                        }`}>
                                                            {soli.estado}
                                                        </span>
                                                        
                                                        {soli.comentariosEncargado && (
                                                            <span className="text-xs text-gray-500 bg-gray-50 p-2 rounded w-full block">
                                                                📝 {soli.comentariosEncargado}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* BOTON ELIMINAR */}
                                                <td className="p-5 text-center align-top">
                                                    <button 
                                                        onClick={() => handleEliminar(soli.id)}
                                                        className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
                                                        title="Eliminar del historial"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-400">
                                        No hay solicitudes en esta sección.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListaSolicitudesEncargado;