import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getEvaluacionById } from '@services/evaluacionSupervisor.service';

const VerEvaluacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getEvaluacionById(id);
      const ev = res.data || res;
      setEvaluacion(ev);
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo cargar la evaluación', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading && !evaluacion) return <div className="p-6">Cargando...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 md:p-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{evaluacion?.pauta?.nombre || 'Evaluación'}</h1>
            <p className="text-sm text-gray-600">Estudiante: <span className="font-semibold">{evaluacion?.estudiante?.nombre || '—'}</span></p>
          </div>
          <div>
            <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded-md">Volver</button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Actividades realizadas</label>
            <div className="mt-1 block w-full border rounded-md p-3 bg-gray-50">{evaluacion?.actividadesRealizadas || '—'}</div>
          </div>

          <div>
            <div className="mb-3 text-sm text-gray-700">
              <span className="font-medium">Escala:</span> A-Sobresaliente, B-Bueno, C-Moderado, D-Suficiente, E-Insuficiente, F-No aplica
            </div>
            {evaluacion?.pauta?.aspectos_a_evaluar?.map((asp, compIdx) => (
              <div key={compIdx} className="mb-4 border-b pb-4">
                <div>
                  <div className="font-semibold">{asp.competencia}</div>
                  <div className="text-sm text-gray-600">{asp.descripcion}</div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  {asp.actitudes.map((act, actIdx) => {
                    const respuestaObj = (evaluacion.respuestas || []).find(r => r.competencia === asp.competencia);
                    const value = respuestaObj && Array.isArray(respuestaObj.evaluacion) ? respuestaObj.evaluacion[actIdx] : null;
                    return (
                      <div key={actIdx} className="flex items-center justify-between">
                        <div className="w-1/3 text-sm">{act}</div>
                        <div className="text-sm font-medium">{value || '—'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="font-medium">Fortalezas</div>
              <div className="mt-1 block w-full border rounded-md p-3 bg-gray-50">{evaluacion?.fortalezas || '—'}</div>
            </div>
            <div>
              <div className="font-medium">Debilidades</div>
              <div className="mt-1 block w-full border rounded-md p-3 bg-gray-50">{evaluacion?.debilidades || '—'}</div>
            </div>
            <div>
              <div className="font-medium">Observaciones generales</div>
              <div className="mt-1 block w-full border rounded-md p-3 bg-gray-50">{evaluacion?.observacionesGenerales || '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerEvaluacion;
