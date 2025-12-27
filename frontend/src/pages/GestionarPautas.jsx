import { useEffect, useState } from 'react';
import { getPautas, deletePauta } from '@services/pauta.service';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const GestionarPautas = () => {
  const [pautas, setPautas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await getPautas();
      setPautas(res.data || res);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudieron cargar las pautas' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleEliminar = (pauta) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la pauta "${pauta.nombre}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePauta(pauta.id);
          Swal.fire('Eliminada', 'La pauta fue eliminada.', 'success');
          load();
        } catch (err) {
          Swal.fire('Error', err.message || 'No se pudo eliminar la pauta', 'error');
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 md:p-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestionar Pautas de Evaluación</h1>
          <div>
            <button onClick={() => navigate('/dashboard/pautas/crear')} className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2">Crear Pauta</button>
            <button onClick={() => navigate('/dashboard/pautas')} className="text-gray-600">Volver</button>
          </div>
        </div>

        {loading ? (
          <p>Cargando pautas...</p>
        ) : (
          <div className="space-y-4">
            {pautas.length === 0 && <p className="text-gray-500">No hay pautas registradas.</p>}
            {pautas.map((p) => (
              <div key={p.id} className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{p.nombre}</div>
                  <div className="text-sm text-gray-500">{p.carrera} · Nivel: {p.nivelPractica} · Modificado: {new Date(p.updated_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/dashboard/pautas/editar/${p.id}`)} className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded-md">Editar</button>
                  <button onClick={() => handleEliminar(p)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionarPautas;
