import { useEffect, useState } from 'react';
import { getSupervisores, getEstudiantes } from '@services/user.service';
import { getPautas } from '@services/pauta.service';
import { createEvaluacionSupervisor } from '@services/evaluacionSupervisor.service';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CrearEvaluacionSupervisor = () => {
  const [supervisores, setSupervisores] = useState([]);
  const [pautas, setPautas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedPauta, setSelectedPauta] = useState('');
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const supRes = await getSupervisores();
        setSupervisores(supRes.data || supRes);
        const pautRes = await getPautas();
        setPautas(pautRes.data || pautRes);
        const estRes = await getEstudiantes();
        setEstudiantes(estRes.data || estRes);
      } catch (err) {
        Swal.fire('Error', err.message || 'No se pudieron cargar datos', 'error');
      } finally { setLoading(false); }
    };
    load();
  }, []);

  // estudiantes filtrados por la pauta seleccionada
  const estudiantesFiltrados = () => {
    if (!selectedPauta) return [];
    const pauta = pautas.find(p => String(p.id) === String(selectedPauta));
    if (!pauta) return [];
    return (estudiantes || []).filter(e => {
      const estudianteCarreraId = e.carrera?.id ?? e.carrera ?? null;
      const pautaCarreraId = pauta.carrera?.id ?? pauta.carrera ?? null;
      if (!estudianteCarreraId || !pautaCarreraId) return false;
      return String(estudianteCarreraId) === String(pautaCarreraId)
        && String((e.nivelPractica||'').trim()).toUpperCase() === String((pauta.nivelPractica||'').trim()).toUpperCase();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupervisor || !selectedPauta || !selectedEstudiante) return Swal.fire('Faltan datos', 'Seleccione supervisor, pauta y estudiante', 'warning');
    try {
      setLoading(true);
      const payload = { idPauta: Number(selectedPauta), idEstudiante: Number(selectedEstudiante), idSupervisor: Number(selectedSupervisor), estado: 'pendiente' };
      await createEvaluacionSupervisor(payload);
      Swal.fire('Creada', 'Evaluación creada correctamente', 'success');
      navigate('/dashboard/evaluaciones/gestionar');
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo crear la evaluación', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 md:p-12">
        <button onClick={() => navigate('/dashboard/evaluaciones/gestionar')} className="mb-4 text-gray-600">← Volver</button>
        <h1 className="text-2xl font-bold mb-4">Crear Evaluación de Supervisor</h1>

        {loading ? <p>Cargando...</p> : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Supervisor</label>
              <select value={selectedSupervisor} onChange={e=>setSelectedSupervisor(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm">
                <option value="">-- Seleccione --</option>
                {supervisores.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.email})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pauta de evaluación</label>
              <select value={selectedPauta} onChange={e=>{ setSelectedPauta(e.target.value); setSelectedEstudiante(''); }} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm">
                <option value="">-- Seleccione --</option>
                {pautas.map(p => <option key={p.id} value={p.id}>{p.nombre} — {p.carrera?.nombre || p.carrera || 'Carrera desconocida'} (Nivel {p.nivelPractica})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Estudiante (misma carrera y nivel de la pauta)</label>
              <select value={selectedEstudiante} onChange={e=>setSelectedEstudiante(e.target.value)} disabled={!selectedPauta} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm">
                <option value="">-- Seleccione --</option>
                {estudiantesFiltrados().map(st => <option key={st.id} value={st.id}>{st.nombre} — {st.rut || st.email}</option>)}
              </select>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">{loading? 'Creando...' : 'Crear Evaluación'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CrearEvaluacionSupervisor;
