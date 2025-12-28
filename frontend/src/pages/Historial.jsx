import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistorial } from '../services/evaluacionEncargado.service';

const Historial = () => {
    const navigate = useNavigate();
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                const res = await getHistorial();
                setEvaluaciones(res.data || res);
            } catch (error) {
                console.error("Error cargando historial", error);
            } finally {
                setLoading(false);
            }
        };
        cargarHistorial();
    }, []);

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">

                {/* Header con botón para volver */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800">📚 Historial de Evaluaciones</h1>
                    <button
                        onClick={() => navigate('/home-encargado')}
                        className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                        ⬅ Volver al Panel
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="p-6 overflow-x-auto">
                        {loading ? (
                            <p className="text-center text-gray-500">Cargando historial...</p>
                        ) : evaluaciones.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">Aún no has realizado evaluaciones.</p>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                        <th className="p-4">Estudiante</th>
                                        <th className="p-4 text-center">Nota Empresa</th>
                                        <th className="p-4 text-center">Nota Encargado</th>
                                        <th className="p-4 text-center font-bold text-indigo-700">Nota Final</th>
                                        <th className="p-4 text-center">Pauta Subida</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {evaluaciones.map((eva) => (
                                        <tr key={eva.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-800">
                                                {eva.solicitud?.estudiante?.nombre || "Estudiante"}
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {eva.notaSupervisor || "-"}
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {eva.notaEncargado}
                                            </td>
                                            <td className="p-4 text-center font-bold text-lg text-indigo-600">
                                                {eva.notaFinal}
                                            </td>
                                            <td className="p-4 text-center">
                                                {eva.urlPauta ? (
                                                    <a
                                                        href={eva.urlPauta}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline text-sm"
                                                    >
                                                        📄 Ver PDF
                                                    </a>
                                                ) : <span className="text-gray-400 text-xs">Sin archivo</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Historial;