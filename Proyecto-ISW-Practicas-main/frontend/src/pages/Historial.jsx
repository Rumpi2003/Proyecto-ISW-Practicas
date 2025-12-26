import { useState, useEffect } from 'react';
import axios from '../services/root.service';
import { useNavigate } from 'react-router-dom';

const Historial = () => {
    const navigate = useNavigate();

    const [evaluaciones, setEvaluaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                // Se realiza la petición al endpoint de historial
                const response = await axios.get('/encargado/historial');
                const dataRaw = response.data.data || response.data;
                
                // Se filtra solo los registros que ya tienen nota final (prácticas terminadas)
                setEvaluaciones(dataRaw.filter(item => item.notaFinal !== null));
            } catch (error) {
                console.error("Error cargando historial", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistorial();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">📜 Historial de Evaluaciones</h1>
                    <p className="text-gray-500 mt-1">Registro de notas finales de alumnos.</p>
                </div>
                <button 
                    onClick={() => navigate('/home')} 
                    className="bg-white border px-5 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    ⬅ Volver
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wider">
                        <tr>
                            <th className="p-5 font-bold">Estudiante</th>
                            <th className="p-5 font-bold text-center">Nota Supervisor/a</th>
                            <th className="p-5 font-bold text-center">Nota Encargado/a</th>
                            <th className="p-5 font-bold text-center bg-blue-50 text-blue-800 border-l border-blue-100">Promedio Final</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-10 text-center text-gray-400">Cargando historial...</td>
                            </tr>
                        ) : evaluaciones.length > 0 ? (
                            evaluaciones.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-5">
                                        <div className="font-bold text-gray-900">
                                            {item.estudiante?.nombre || "Estudiante"}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {item.estudiante?.correo}
                                        </div>
                                    </td>
                                    <td className="p-5 text-center font-semibold">
                                        {item.notaSupervisor || "—"}
                                    </td>
                                    <td className="p-5 text-center font-semibold">
                                        {item.notaEncargado || "—"}
                                    </td>
                                    <td className="p-5 text-center font-black text-blue-700 bg-blue-50/50 border-l border-blue-100 text-lg">
                                        {item.notaFinal}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-10 text-center text-gray-400">No hay registros de evaluaciones finalizadas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Historial;