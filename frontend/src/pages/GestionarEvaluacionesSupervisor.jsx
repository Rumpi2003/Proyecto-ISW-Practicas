import { useEffect, useState } from 'react';
import { getEvaluacionesSupervisor, deleteEvaluacionSupervisor } from '@services/evaluacionSupervisor.service';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const GestionarEvaluacionesSupervisor = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await getEvaluacionesSupervisor();
      setEvaluaciones(res.data || res);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudieron cargar las evaluaciones' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleEliminar = (ev) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la evaluación (ID: ${ev.id}). Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEvaluacionSupervisor(ev.id);
          Swal.fire('Eliminada', 'La evaluación fue eliminada.', 'success');
          load();
        } catch (err) {
          Swal.fire('Error', err.message || 'No se pudo eliminar la evaluación', 'error');
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 md:p-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestionar Evaluaciones de Supervisor</h1>
          <div>
            <button onClick={() => navigate('/dashboard/evaluaciones/crear')} className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2">Crear Evaluación</button>
            <button onClick={() => navigate('/dashboard')} className="text-gray-600">Volver</button>
          </div>
        </div>

        {loading ? (
          <p>Cargando evaluaciones...</p>
        ) : (
          <div className="space-y-4">
            {evaluaciones.length === 0 && <p className="text-gray-500">No hay evaluaciones registradas.</p>}
            {evaluaciones.map((e) => (
              <div key={e.id} className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold">{e.pauta?.nombre || `Pauta #${e.idPauta}`}</div>
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${e.estado === 'completada' ? 'bg-green-100 text-green-800' : e.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{e.estado}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{(e.estudiante?.nombre || 'estudiante') + '-' + (e.supervisor?.nombre || 'supervisor')}</div>
                  <div className="text-sm text-gray-500">
                    {e.pauta?.carrera || 'Carrera desconocida'} · Nivel: {e.pauta?.nivelPractica || '—'} · Fecha: {e.fechaEvaluacion ? new Date(e.fechaEvaluacion).toLocaleString() : new Date(e.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEliminar(e)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionarEvaluacionesSupervisor;
