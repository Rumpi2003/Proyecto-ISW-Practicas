import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMisSolicitudes, updateSolicitud } from '@services/solicitud.service';
import Swal from 'sweetalert2';

const MisSolicitudes = () => {
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState([]);
    const [editingId, setEditingId] = useState(null); 
  
    const [editMensaje, setEditMensaje] = useState('');
    const [editArchivo, setEditArchivo] = useState(null);

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const cargarSolicitudes = async () => {
        try {
            const response = await getMisSolicitudes();
            setSolicitudes(response.data || []); 
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (soli) => {
        setEditingId(soli.id);
        setEditMensaje(soli.mensaje);
        setEditArchivo(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('mensaje', editMensaje);
        if (editArchivo) {
            formData.append('archivo', editArchivo);
        }

        try {
            await updateSolicitud(editingId, formData);
            Swal.fire('Actualizado', 'La solicitud fue corregida y enviada a revisión', 'success');
            setEditingId(null); 
        cargarSolicitudes();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo editar', 'error');
        }
    };
    
    return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* BOTÓN VOLVER */}
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => navigate('/solicitudes')} 
                className="bg-white px-4 py-2 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 shadow-sm transition-all text-gray-700"
            >
                ← Volver
            </button>
            <h1 className="text-3xl font-bold text-white">📂 Mis Postulaciones</h1>
        </div>
        <div className="grid gap-6">
            {solicitudes.map((soli) => (
                <div key={soli.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    
                    {/* MODO EDICIÓN */}
                    {editingId === soli.id ? (
                        <form onSubmit={handleUpdate} className="space-y-4 bg-blue-50 p-4 rounded-xl">
                            <h3 className="font-bold text-blue-800">✏️ Editando Solicitud #{soli.id}</h3>
                            <textarea 
                                className="w-full p-2 rounded border" 
                                value={editMensaje}
                                onChange={e => setEditMensaje(e.target.value)}
                            />
                            <input 
                                type="file" 
                                onChange={e => setEditArchivo(e.target.files[0])}
                                accept=".pdf" 
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer" 
                            />
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 text-gray-600 font-bold">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Guardar Cambios</button>
                            </div>
                        </form>
                    ) : (
                        
                    /* VISTA NORMAL */
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                    ${soli.estado === 'aprobada' ? 'bg-green-100 text-green-700' : ''}
                                    ${soli.estado === 'rechazada' ? 'bg-red-100 text-red-700' : ''}
                                    ${soli.estado === 'espera' ? 'bg-yellow-100 text-yellow-700' : ''}
                                    ${soli.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : ''}
                                `}>
                                    {soli.estado}
                                </span>
                                <span className="text-gray-400 text-sm">#{soli.id}</span>
                            </div>
                            <p className="text-gray-700 font-medium whitespace-pre-wrap">{soli.mensaje}</p>
                            
                            {soli.documentos && soli.documentos.length > 0 && (
                                <div className="mt-2">
                                    <a href={soli.documentos[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-sm flex items-center gap-1">
                                        📎 Ver documento adjunto
                                    </a>
                                </div>
                            )}

                            {soli.comentariosEncargado && (
                                <div className="mt-4 p-4 bg-gray-50 text-gray-700 text-sm rounded-xl border border-gray-200">
                                    <strong className="block text-gray-900 mb-1">💬 Comentario del Encargado:</strong> 
                                    {soli.comentariosEncargado}
                                </div>
                            )}
                        </div>

                        {/* BOTÓN EDITAR */}
                        {soli.estado !== 'aprobada' && (
                            <button 
                                onClick={() => handleEditClick(soli)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                            >
                                ✏️ Editar
                            </button>
                        )}
                    </div>
                    )}
                </div>
            ))}

            {solicitudes.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                    No tienes solicitudes creadas aún.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MisSolicitudes;