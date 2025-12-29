import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerTodosLosInformes, actualizarEstadoInforme } from '../services/informe.service';
import Swal from 'sweetalert2';

const GestionarInformes = () => {
  const navigate = useNavigate();
  const [informes, setInformes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    try {
      setCargando(true);
      const response = await obtenerTodosLosInformes();
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
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rechazado':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'revisado':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const iniciarEdicion = (informe) => {
    setEditandoId(informe.id);
    setNuevoEstado(informe.estado);
    setComentarios(informe.comentariosEncargado || '');
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNuevoEstado('');
    setComentarios('');
  };

  const guardarEstado = async (idInforme) => {
    if (!nuevoEstado) {
      return Swal.fire('Falta estado', 'Debes seleccionar un estado', 'warning');
    }

    try {
      setGuardando(true);
      await actualizarEstadoInforme(idInforme, nuevoEstado, comentarios);
      Swal.fire('Actualizado', 'Estado de informe actualizado correctamente', 'success');
      cancelarEdicion();
      cargarInformes();
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message || 'No se pudo actualizar el estado', 'error');
    } finally {
      setGuardando(false);
    }
  };

  const informesFiltrados = informes.filter((i) => {
    if (filtroEstado === 'todos') return true;
    return i.estado === filtroEstado;
  });

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-white px-4 py-2 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 shadow-sm transition-all text-gray-700 mb-4"
          >
            ← Volver
          </button>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <span>📋</span>
            Gestionar Informes
          </h1>
          <p className="text-gray-600 mt-2">Revisa y gestiona los informes subidos por los estudiantes</p>
        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Filtrar por estado</h3>
          <div className="flex flex-wrap gap-3">
            {['todos', 'pendiente', 'revisado', 'aprobado', 'rechazado'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filtroEstado === estado
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Mostrando {informesFiltrados.length} de {informes.length} informes
          </p>
        </div>

        {/* LISTA DE INFORMES */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-gray-500">Cargando informes...</p>
          </div>
        ) : informesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-6xl mb-4">📭</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No hay informes</h3>
            <p className="text-gray-500">
              {filtroEstado === 'todos'
                ? 'Aún no se han subido informes'
                : `No hay informes con estado "${filtroEstado}"`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {informesFiltrados.map((informe) => (
              <div
                key={informe.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📄</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Informe #{informe.id}
                      </h3>
                      <p className="text-sm text-gray-600 font-semibold">
                        Estudiante: {informe.estudiante?.nombre} {informe.estudiante?.apellido}
                      </p>
                      <p className="text-xs text-gray-500">
                        RUT: {informe.estudiante?.rut} | {informe.estudiante?.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
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
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase border ${getEstadoColor(
                      informe.estado
                    )}`}
                  >
                    {informe.estado}
                  </span>
                </div>

                {/* Descripción */}
                <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-1">Descripción:</h4>
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

                {/* Comentarios anteriores */}
                {informe.comentariosEncargado && editandoId !== informe.id && (
                  <div className="mb-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-bold text-blue-700 mb-1 flex items-center gap-2">
                      <span>💬</span>
                      Comentarios anteriores:
                    </h4>
                    <p className="text-gray-700">{informe.comentariosEncargado}</p>
                    {informe.fechaRevision && (
                      <p className="text-xs text-gray-500 mt-2">
                        Revisado: {new Date(informe.fechaRevision).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                )}

                {/* Edición de estado */}
                {editandoId === informe.id ? (
                  <div className="border border-dashed border-blue-300 rounded-xl p-4 bg-blue-50/40">
                    <h4 className="text-sm font-bold text-gray-800 mb-3">Actualizar estado y comentarios</h4>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nuevo estado
                      </label>
                      <select
                        value={nuevoEstado}
                        onChange={(e) => setNuevoEstado(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="revisado">Revisado</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="rechazado">Rechazado</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Comentarios (opcional)
                      </label>
                      <textarea
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                        placeholder="Agrega comentarios para el estudiante..."
                        rows={4}
                        maxLength={1000}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {comentarios.length}/1000 caracteres
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => guardarEstado(informe.id)}
                        disabled={guardando}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
                      >
                        {guardando ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        disabled={guardando}
                        className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-60 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => iniciarEdicion(informe)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      ✏️ Revisar / Cambiar estado
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionarInformes;
