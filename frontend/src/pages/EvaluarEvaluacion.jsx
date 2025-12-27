import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getEvaluacionById, updateEvaluacionSupervisor } from '@services/evaluacionSupervisor.service';

const OPCIONES = [
  { key: 'A', label: 'A-Sobresaliente' },
  { key: 'B', label: 'B-Bueno' },
  { key: 'C', label: 'C-Moderado' },
  { key: 'D', label: 'D-Suficiente' },
  { key: 'E', label: 'E-Insuficiente' },
  { key: 'F', label: 'F-No aplica' },
];

const EvaluarEvaluacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(false);

  const [actividades, setActividades] = useState('');
  const [respuestas, setRespuestas] = useState([]); // array of arrays por competencia
  const [fortalezas, setFortalezas] = useState('');
  const [debilidades, setDebilidades] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await getEvaluacionById(id);
      const ev = res.data || res;
      setEvaluacion(ev);
      setActividades(ev.actividadesRealizadas || '');
      setFortalezas(ev.fortalezas || '');
      setDebilidades(ev.debilidades || '');
      setObservaciones(ev.observacionesGenerales || '');

      const aspectos = ev.pauta?.aspectos_a_evaluar || [];
      if (ev.respuestas && Array.isArray(ev.respuestas) && ev.respuestas.length > 0) {
        // Map to arrays
        const map = aspectos.map((asp) => {
          const found = ev.respuestas.find(r => r.competencia === asp.competencia);
          if (found && Array.isArray(found.evaluacion)) return found.evaluacion.slice(0, asp.actitudes.length);
          return Array(asp.actitudes.length).fill('');
        });
        setRespuestas(map);
      } else {
        setRespuestas(aspectos.map(asp => Array(asp.actitudes.length).fill('')));
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo cargar la evaluación', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleRespuestaChange = (compIdx, actIdx, value) => {
    setRespuestas(prev => {
      const copy = prev.map(r => r.slice());
      copy[compIdx][actIdx] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!evaluacion) return;
    // Build respuestas payload
    const aspectos = evaluacion.pauta?.aspectos_a_evaluar || [];
    const payloadRespuestas = aspectos.map((asp, idx) => ({ competencia: asp.competencia, evaluacion: respuestas[idx] || Array(asp.actitudes.length).fill('') }));

    const payload = {
      actividadesRealizadas: actividades,
      respuestas: payloadRespuestas,
      fortalezas,
      debilidades,
      observacionesGenerales: observaciones,
      fechaEvaluacion: new Date().toISOString(),
      estado: 'completada'
    };

    try {
      setLoading(true);
      await updateEvaluacionSupervisor(evaluacion.id, payload);
      Swal.fire('Guardado', 'Evaluación completada correctamente', 'success');
      navigate('/dashboard');
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo guardar la evaluación', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !evaluacion) return <div className="p-6">Cargando...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 md:p-12">
        <h1 className="text-2xl font-bold mb-2">{evaluacion?.pauta?.nombre || 'Evaluación'}</h1>
        <p className="text-sm text-gray-600 mb-6">Estudiante: <span className="font-semibold">{evaluacion?.estudiante?.nombre || '—'}</span></p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Actividades realizadas</label>
            <textarea value={actividades} onChange={(e) => setActividades(e.target.value)} rows={4} className="mt-1 block w-full border rounded-md p-2" />
          </div>

          <div>
            <div className="mb-3 text-sm text-gray-700">
              <span className="font-medium">Escala:</span> A-Sobresaliente, B-Bueno, C-Moderado, D-Suficiente, E-Insuficiente, F-No aplica
            </div>
            {evaluacion?.pauta?.aspectos_a_evaluar?.map((asp, compIdx) => (
              <div key={compIdx} className="mb-4 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{asp.competencia}</div>
                    <div className="text-sm text-gray-600">{asp.descripcion}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  {asp.actitudes.map((act, actIdx) => (
                    <div key={actIdx} className="flex items-center justify-between">
                      <div className="w-1/3 text-sm">{act}</div>
                      <div className="flex gap-2">
                        {OPCIONES.map(opt => (
                          <label key={opt.key} className="inline-flex items-center gap-1 text-sm">
                            <input type="radio" name={`r-${compIdx}-${actIdx}`} value={opt.key} checked={(respuestas[compIdx] && respuestas[compIdx][actIdx]) === opt.key} onChange={() => handleRespuestaChange(compIdx, actIdx, opt.key)} />
                            <span className="text-xs">{opt.key}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fortalezas</label>
              <textarea value={fortalezas} onChange={(e) => setFortalezas(e.target.value)} rows={2} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Debilidades</label>
              <textarea value={debilidades} onChange={(e) => setDebilidades(e.target.value)} rows={2} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Observaciones generales</label>
              <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={3} className="mt-1 block w-full border rounded-md p-2" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Guardar y Finalizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluarEvaluacion;
