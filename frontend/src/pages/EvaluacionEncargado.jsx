// src/pages/EvaluacionEncargado.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetallePractica, evaluarPractica } from '../services/evaluacionEncargado.service';
import Swal from 'sweetalert2';

const EvaluacionEncargado = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados de carga y datos
    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados para el formulario de evaluación
    const [nota, setNota] = useState("");
    const [comentarios, setComentarios] = useState("");
    const [archivoPauta, setArchivoPauta] = useState(null);

    // URL Base para archivos estáticos del backend
    const API_URL = "http://localhost:3000";

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await getDetallePractica(id);
                setDetalle(res.data);
            } catch (err) {
                console.error("Error al cargar detalles:", err);
                Swal.fire("Error", "No se pudo cargar la información del estudiante", "error");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!archivoPauta) {
            Swal.fire("Falta la Pauta", "Debes subir el PDF de la pauta de corrección.", "warning");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nota", nota);
            formData.append("comentarios", comentarios);
            formData.append("pauta", archivoPauta);

            await evaluarPractica(id, formData);
            
            Swal.fire({
                title: "¡Éxito!",
                text: "Evaluación finalizada y promedio calculado correctamente.",
                icon: "success",
                confirmButtonColor: "#3085d6"
            });
            
            navigate('/dashboard');
        } catch (err) {
            console.error("Error al calificar:", err);
            const msg = err.response?.data?.message || "No se pudo guardar la evaluación";
            Swal.fire("Error", msg, "error");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 font-medium">Cargando datos del estudiante...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Revisión y Evaluación Final</h1>
                <p className="text-gray-600">Califique el desempeño del estudiante basándose en los documentos entregados.</p>
            </header>

            {/* SECCIÓN DE VISUALIZACIÓN DE DOCUMENTOS (REQUISITO) */}
            <section className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
                <h2 className="text-xl font-semibold mb-5 flex items-center text-gray-700">
                    <span className="mr-2">📂</span> Documentos del Estudiante
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    {/* Informe Final */}
                    <div className="p-5 border-2 border-dashed border-blue-100 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                        <p className="font-bold text-blue-800 mb-3">Informe Final de Práctica</p>
                        <a 
                            href={`${API_URL}/uploads/${detalle?.informeFinal}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Ver Documento PDF
                        </a>
                    </div>

                    {/* Bitácoras */}
                    <div className="p-5 border-2 border-dashed border-blue-100 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                        <p className="font-bold text-blue-800 mb-3">Bitácoras de Actividades</p>
                        <a 
                            href={`${API_URL}/uploads/${detalle?.bitacoras}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Ver Documento PDF
                        </a>
                    </div>
                </div>

                {/* Nota del Supervisor (Requisito para el promedio) */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-amber-800 font-medium">Calificación del Supervisor (Empresa):</p>
                        <p className="text-sm text-amber-600 italic">Esta nota será promediada con su calificación.</p>
                    </div>
                    <span className="text-2xl font-black text-amber-700 bg-white px-4 py-1 rounded-lg border border-amber-200 shadow-sm">
                        {detalle?.notaSupervisor || "Pte."}
                    </span>
                </div>
            </section>

            {/* FORMULARIO DE EVALUACIÓN DEL ENCARGADO */}
            <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 text-gray-700">✍️ Registro de Calificación</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nota Encargado</label>
                            <input 
                                type="number" 
                                step="0.1" 
                                min="1" 
                                max="7" 
                                value={nota} 
                                onChange={(e) => setNota(e.target.value)} 
                                required 
                                placeholder="1.0 - 7.0"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Retroalimentación / Comentarios</label>
                            <textarea 
                                value={comentarios} 
                                onChange={(e) => setComentarios(e.target.value)} 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                                rows="3"
                                placeholder="Ingrese observaciones sobre el desempeño del estudiante..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pauta de Corrección Firmada (PDF)</label>
                        <input 
                            type="file" 
                            accept="application/pdf" 
                            onChange={(e) => setArchivoPauta(e.target.files[0])} 
                            required 
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                        />
                        <p className="text-xs text-gray-500 mt-2 italic">Suba el archivo PDF que respalda la evaluación final.</p>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button 
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="flex-[2] bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            Confirmar y Finalizar Evaluación
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default EvaluacionEncargado;