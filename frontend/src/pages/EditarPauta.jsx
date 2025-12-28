import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPautaById, updatePauta } from '@services/pauta.service';
import { getCarreras } from '@services/carrera.service';

const MAX_ASPECTOS = 11;
const MAX_ACTITUDES = 5;

function NuevaSeccion() { return { competencia: '', descripcion: '', actitudes: [''] }; }

const EditarPauta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [carrerasOptions, setCarrerasOptions] = useState([]);
  const [nivelPractica, setNivelPractica] = useState('I');
  const [aspectos, setAspectos] = useState([NuevaSeccion()]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getPautaById(id);
        const pauta = res.data || res;
        setNombre(pauta.nombre || '');
        // aceptar tanto idCarrera como objeto carrera
        setCarrera(pauta.idCarrera ?? pauta.carrera?.id ?? pauta.carrera ?? '');
        setNivelPractica(pauta.nivelPractica || 'I');
        const mapped = (pauta.aspectos_a_evaluar || []).map(a => ({
          competencia: a.competencia || '',
          descripcion: a.descripcion || '',
          actitudes: Array.isArray(a.actitudes) && a.actitudes.length ? a.actitudes : ['']
        }));
        setAspectos(mapped.length ? mapped : [NuevaSeccion()]);
      } catch (err) {
        Swal.fire('Error', err.message || 'No se pudo cargar la pauta', 'error');
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  useEffect(() => {
    let mounted = true;
    const fetchCarreras = async () => {
      try {
        const res = await getCarreras();
        if (!mounted) return;
        setCarrerasOptions(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Error cargando carreras', err);
        setCarrerasOptions([]);
      }
    };
    fetchCarreras();
    return () => { mounted = false; };
  }, []);

  const agregarAspecto = () => { if (aspectos.length >= MAX_ASPECTOS) return; setAspectos(prev => [...prev, NuevaSeccion()]); };
  const eliminarAspecto = (index) => {
    if (aspectos.length === 1) {
      return Swal.fire({ icon: 'info', title: 'Acción no permitida', text: 'Debe existir al menos una sección.' });
    }
    Swal.fire({
      title: '¿Eliminar sección?',
      text: 'Se eliminará la competencia y todas sus actitudes. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        setAspectos(prev => prev.filter((_, i) => i !== index));
      }
    });
  };
  const actualizarAspecto = (index, field, value) => setAspectos(prev => prev.map((a,i)=>i===index?{...a,[field]:value}:a));
  const agregarActitud = (index) => setAspectos(prev=>prev.map((a,i)=>i===index?{...a,actitudes:[...a.actitudes,'']}:a));
  const actualizarActitud = (aspectIndex, actIndex, value) => setAspectos(prev=>prev.map((a,i)=>{ if(i!==aspectIndex) return a; const newActs=a.actitudes.map((act,j)=>j===actIndex?value:act); return {...a,actitudes:newActs}; }));
  const eliminarActitud = (aspectIndex, actIndex) => setAspectos(prev=>prev.map((a,i)=>{ if(i!==aspectIndex) return a; if(a.actitudes.length===1) return a; const newActs=a.actitudes.filter((_,j)=>j!==actIndex); return {...a,actitudes:newActs}; }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !String(carrera).trim()) return Swal.fire({ icon: 'error', title: 'Faltan datos', text: 'Ingrese nombre y carrera.' });
    const aspectos_a_evaluar = aspectos.map(a=>({ competencia:a.competencia||'', descripcion:a.descripcion||'', actitudes:a.actitudes.filter(Boolean) }));
    const payload = { nombre, carrera: Number(carrera), nivelPractica, aspectos_a_evaluar };
    try {
      setLoading(true);
      await updatePauta(id, payload);
      Swal.fire('Actualizado', 'Pauta actualizada correctamente', 'success');
      navigate('/dashboard/pautas/gestionar');
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo actualizar la pauta', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 md:p-12">
        <button onClick={() => navigate('/dashboard/pautas/gestionar')} className="mb-4 text-gray-600">← Volver</button>
        <h1 className="text-2xl font-bold mb-4">Editar Pauta de Evaluación</h1>

        {loading ? <p>Cargando...</p> : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la pauta</label>
            <input value={nombre} onChange={e=>setNombre(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Carrera</label>
            <select value={carrera} onChange={e=>setCarrera(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm">
              <option value="">Seleccione una carrera</option>
              {carrerasOptions.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}{c.abreviacion ? ` — ${c.abreviacion}` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nivel de práctica</label>
            <select value={nivelPractica} onChange={e=>setNivelPractica(e.target.value)} className="mt-1 block w-40 rounded-md border-gray-200 shadow-sm">
              <option value="I">I</option>
              <option value="II">II</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Aspectos a evaluar</h2>
              <button type="button" onClick={agregarAspecto} disabled={aspectos.length>=MAX_ASPECTOS} className="text-sm text-blue-600">Agregar sección ({aspectos.length}/{MAX_ASPECTOS})</button>
            </div>

            <div className="space-y-6 mt-4">
              {aspectos.map((a,i)=> (
                <div key={i} className="p-4 border rounded-lg">
                  {aspectos.length > 1 && (
                    <div className="flex justify-end mb-2">
                      <button type="button" onClick={() => eliminarAspecto(i)} className="text-sm text-red-500">Eliminar sección</button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">Competencia</label>
                      <input value={a.competencia} onChange={e=>actualizarAspecto(i,'competencia',e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">Descripción</label>
                      <input value={a.descripcion} onChange={e=>actualizarAspecto(i,'descripcion',e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">Actitudes</label>
                      <div className="space-y-2">
                        {a.actitudes.map((act,j)=>(
                          <div key={j} className="flex gap-2">
                            <input value={act} onChange={e=>actualizarActitud(i,j,e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                            <button type="button" onClick={()=>eliminarActitud(i,j)} className="text-red-500">Eliminar</button>
                          </div>
                        ))}
                        <div className="pt-2">
                          <button type="button" disabled={a.actitudes.length>=MAX_ACTITUDES} onClick={()=>agregarActitud(i)} className="text-sm text-blue-600">Agregar actitud ({a.actitudes.length}/{MAX_ACTITUDES})</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-amber-600 text-white px-4 py-2 rounded-md">{loading? 'Guardando...' : 'Editar Pauta'}</button>
          </div>
        </form>)}
      </div>
    </div>
  );
};

export default EditarPauta;
