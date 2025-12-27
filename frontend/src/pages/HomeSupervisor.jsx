import { useAuth } from '@context/AuthContext';
import { logout } from '@services/auth.service';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { getEvaluacionesBySupervisor } from '@services/evaluacionSupervisor.service';

const HomeSupervisor = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        logout();
        setUser(null);
        navigate('/auth');
    };

    const load = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const res = await getEvaluacionesBySupervisor(user.id);
            setEvaluaciones(res.data || res);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudieron cargar las evaluaciones' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [user]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl p-8 md:p-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Mis Evaluaciones</h1>
                        <p className="text-sm text-gray-500">Supervisor: <span className="font-semibold">{user?.nombre}</span></p>
                    </div>
                    <div>
                        <button onClick={handleLogout} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md font-semibold border border-red-100">Cerrar sesión</button>
                    </div>
                </div>

                {loading ? (
                    <p>Cargando evaluaciones...</p>
                ) : (
                    <div className="space-y-4">
                        {evaluaciones.length === 0 && <p className="text-gray-500">No hay evaluaciones asignadas.</p>}
                        {evaluaciones.map((e) => (
                            <div key={e.id} className="p-4 border rounded-lg flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-lg font-semibold">{e.pauta?.nombre || `Pauta #${e.idPauta}`}</div>
                                        <div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${e.estado === 'completada' ? 'bg-green-100 text-green-800' : e.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{e.estado}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">{(e.estudiante?.nombre || 'estudiante') + '-' + (e.supervisor?.nombre || user?.nombre || 'supervisor')}</div>
                                    <div className="text-sm text-gray-500">
                                        {e.pauta?.carrera || 'Carrera desconocida'} · Nivel: {e.pauta?.nivelPractica || '—'} · Fecha: {e.fechaEvaluacion ? new Date(e.fechaEvaluacion).toLocaleString() : new Date(e.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {e.estado === 'completada' ? (
                                        <button onClick={() => navigate(`/dashboard/evaluaciones/ver/${e.id}`)} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Ver</button>
                                    ) : (
                                        <button
                                            onClick={() => navigate(`/dashboard/evaluaciones/evaluar/${e.id}`)}
                                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        >
                                            Evaluar
                                        </button>
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

export default HomeSupervisor;