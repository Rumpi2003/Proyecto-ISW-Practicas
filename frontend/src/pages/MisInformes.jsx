import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerMisInformes, actualizarInformePropio, eliminarInformePropio } from '../services/informe.service';
import Swal from 'sweetalert2';

const MisInformes = () => {
  const navigate = useNavigate();
  const [informes, setInformes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [nuevoArchivo, setNuevoArchivo] = useState(null);
  const [guardandoId, setGuardandoId] = useState(null);

  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    try {
      setCargando(true);
      const response = await obtenerMisInformes();
      setInformes(response.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los informes', 'error');
    } finally {
      setCargando(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobado':
        return 'bg-green-100 text-green-700';
      case 'rechazado':
        return 'bg-red-100 text-red-700';
      case 'revisado':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const handleEditarArchivo = (id) => {
    setEditingId(id);
    setNuevoArchivo(null);
  };

  const handleCancelarEdicion = () => {
    setEditingId(null);
    setNuevoArchivo(null);
  };

  const handleGuardarArchivo = async (informe) => {
    if (!nuevoArchivo) {
      return Swal.fire('Falta archivo', 'Debes adjuntar un PDF para reemplazar', 'warning');
    }
    try {
      setGuardandoId(informe.id);
      await actualizarInformePropio(informe.id, nuevoArchivo, informe.descripcion);
      Swal.fire('Actualizado', 'Informe actualizado correctamente', 'success');
      handleCancelarEdicion();
      cargarInformes();
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message || 'No se pudo actualizar el informe', 'error');
    } finally {
      setGuardandoId(null);
    }
  };

  const handleEliminar = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar informe?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;

    try {
      await eliminarInformePropio(id);
      Swal.fire('Eliminado', 'El informe fue eliminado', 'success');
      cargarInformes();
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message || 'No se pudo eliminar el informe', 'error');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-50">
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
              <span>📋</span>
              Mis Informes
            </h1>
            <p className="text-gray-600 mt-2">Historial de informes subidos</p>
          </div>
          <button
            onClick={() => navigate('/informes/subir')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Subir informe
          </button>
        </div>

        {/* LISTA DE INFORMES */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-gray-500">Cargando informes...</p>
          </div>
        ) : informes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-6xl mb-4">📭</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No hay informes</h3>
            <p className="text-gray-500 mb-6">Aún no has subido ningún informe</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {informes.map((informe) => (
              <div key={informe.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                {/* Header del informe */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📄</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Informe #{informe.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Subido: {new Date(informe.fechaSubida).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${getEstadoColor(informe.estado)}`}>
                    {informe.estado}
                  </span>
                </div>

                {/* Descripción */}
                <div className="mb-4">
                  <p className="text-gray-700">{informe.descripcion}</p>
                </div>

                {/* Archivo */}
                {informe.archivo && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">📎 Archivo adjunto:</h4>
                    <a
                      href={informe.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border border-blue-200"
                    >
                      <span>📄</span>
                      Descargar Informe
                    </a>
                  </div>
                )}

                {/* Comentarios del encargado */}
                {informe.comentariosEncargado && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span>💬</span>
                      Comentarios del Encargado:
                    </h4>
                    <p className="text-gray-700">{informe.comentariosEncargado}</p>
                    {informe.fechaRevision && (
                      <p className="text-xs text-gray-500 mt-2">
                        Revisado: {new Date(informe.fechaRevision).toLocaleDateString('es-ES', {
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
                  {editingId === informe.id ? (
                    <div className="border border-dashed border-blue-200 rounded-xl p-4 bg-blue-50/40">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Reemplazar archivo (PDF)</p>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setNuevoArchivo(e.target.files[0])}
                        className="w-full"
                      />
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                        {nuevoArchivo && (
                          <span className="px-3 py-1 bg-white border border-gray-200 rounded-full">{nuevoArchivo.name}</span>
                        )}
                      </div>
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleGuardarArchivo(informe)}
                          disabled={guardandoId === informe.id}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
                        >
                          {guardandoId === informe.id ? 'Guardando...' : 'Guardar cambios'}
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
                        onClick={() => handleEditarArchivo(informe.id)}
                        disabled={informe.estado === 'aprobado'}
                        className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold border border-blue-100 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-50"
                      >
                        ✏️ Editar archivo
                      </button>
                      <button
                        onClick={() => handleEliminar(informe.id)}
                        disabled={informe.estado === 'aprobado'}
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

export default MisInformes;
