import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerMisBitacoras, actualizarBitacoraPropia, eliminarBitacoraPropia } from '../services/bitacora.service';
import Swal from 'sweetalert2';

const MisBitacoras = () => {
  const navigate = useNavigate();
  const [bitacoras, setBitacoras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [nuevosArchivos, setNuevosArchivos] = useState([]);
  const [guardandoId, setGuardandoId] = useState(null);

  useEffect(() => {
    cargarBitacoras();
  }, []);

  const cargarBitacoras = async () => {
    try {
      setCargando(true);
      const response = await obtenerMisBitacoras();
      setBitacoras(response.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar las bitácoras', 'error');
    } finally {
      setCargando(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobada':
        return 'bg-green-100 text-green-700';
      case 'rechazada':
        return 'bg-red-100 text-red-700';
      case 'revisada':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const handleEditarArchivos = (id) => {
    setEditingId(id);
    setNuevosArchivos([]);
  };

  const handleCancelarEdicion = () => {
    setEditingId(null);
    setNuevosArchivos([]);
  };

  const handleGuardarArchivos = async (bitacora) => {
    if (nuevosArchivos.length === 0) {
      return Swal.fire('Falta archivo', 'Debes adjuntar al menos un PDF para reemplazar', 'warning');
    }
    try {
      setGuardandoId(bitacora.id);
      await actualizarBitacoraPropia(bitacora.id, nuevosArchivos, bitacora.descripcion);
      Swal.fire('Actualizado', 'Bitácora actualizada correctamente', 'success');
      handleCancelarEdicion();
      cargarBitacoras();
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message || 'No se pudo actualizar la bitácora', 'error');
    } finally {
      setGuardandoId(null);
    }
  };

  const handleEliminar = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar bitácora?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;

    try {
      await eliminarBitacoraPropia(id);
      Swal.fire('Eliminada', 'La bitácora fue eliminada', 'success');
      cargarBitacoras();
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message || 'No se pudo eliminar la bitácora', 'error');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white px-4 py-2 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 shadow-sm transition-all text-gray-700 mb-4"
            >
              ← Volver
            </button>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <span>📚</span>
              Mis Bitácoras
            </h1>
            <p className="text-gray-600 mt-2">Historial de bitácoras subidas</p>
          </div>
          <button
            onClick={() => navigate('/bitacoras/subir')}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg"
          >
            📤 Subir Nueva Bitácora
          </button>
        </div>

        {/* LISTA DE BITÁCORAS */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-gray-500">Cargando bitácoras...</p>
          </div>
        ) : bitacoras.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-6xl mb-4">📭</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No hay bitácoras</h3>
            <p className="text-gray-500 mb-6">Aún no has subido ninguna bitácora</p>
            <button
              onClick={() => navigate('/bitacoras/subir')}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              Subir Mi Primera Bitácora
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bitacoras.map((bitacora) => (
              <div key={bitacora.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                {/* Header de la bitácora */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📄</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Bitácora #{bitacora.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Subida: {new Date(bitacora.fechaSubida).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${getEstadoColor(bitacora.estado)}`}>
                    {bitacora.estado}
                  </span>
                </div>

                {/* Descripción */}
                <div className="mb-4">
                  <p className="text-gray-700">{bitacora.descripcion}</p>
                </div>

                {/* Archivos */}
                {bitacora.archivos && bitacora.archivos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">📎 Archivos adjuntos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {bitacora.archivos.map((archivo, index) => (
                        <a
                          key={index}
                          href={archivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                        >
                          <span>📄</span>
                          Archivo {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comentarios del encargado */}
                {bitacora.comentariosEncargado && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span>💬</span>
                      Comentarios del Encargado:
                    </h4>
                    <p className="text-gray-700">{bitacora.comentariosEncargado}</p>
                    {bitacora.fechaRevision && (
                      <p className="text-xs text-gray-500 mt-2">
                        Revisado: {new Date(bitacora.fechaRevision).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                )}

                {/* Acciones */}
                <div className="mt-4 flex flex-col gap-3">
                  {editingId === bitacora.id ? (
                    <div className="border border-dashed border-purple-200 rounded-xl p-4 bg-purple-50/40">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Reemplazar archivos (PDF)</p>
                      <input
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={(e) => setNuevosArchivos(Array.from(e.target.files))}
                        className="w-full"
                      />
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                        {nuevosArchivos.map((file, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-full">{file.name}</span>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleGuardarArchivos(bitacora)}
                          disabled={guardandoId === bitacora.id}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-60"
                        >
                          {guardandoId === bitacora.id ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                        <button
                          onClick={handleCancelarEdicion}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEditarArchivos(bitacora.id)}
                        disabled={bitacora.estado === 'aprobada'}
                        className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold border border-blue-100 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-50"
                      >
                        ✏️ Editar archivos
                      </button>
                      <button
                        onClick={() => handleEliminar(bitacora.id)}
                        disabled={bitacora.estado === 'aprobada'}
                        className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-semibold border border-red-100 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-50"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisBitacoras;
