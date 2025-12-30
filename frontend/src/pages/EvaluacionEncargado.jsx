// frontend/src/pages/EvaluacionEncargado.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDetallePractica, evaluarPractica } from "../services/evaluacionEncargado.service.js";
import Swal from "sweetalert2";

const EvaluacionEncargado = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(true);

    const [nota, setNota] = useState("");
    const [comentarios, setComentarios] = useState("");
    const [archivoPauta, setArchivoPauta] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const buildFileUrl = (pathOrUrl) => {
        if (!pathOrUrl) return null;
        if (typeof pathOrUrl === "string" && (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://"))) return pathOrUrl;
        if (typeof pathOrUrl === "string" && pathOrUrl.startsWith("/")) return `${API_URL}${pathOrUrl}`;
        return `${API_URL}/uploads/${pathOrUrl}`;
    };

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await getDetallePractica(id);
                const payload = res?.data ?? res;
                setDetalle(payload);
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "No se pudo cargar la información", "error");
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!archivoPauta || !nota) {
            Swal.fire("Atención", "Debes ingresar la nota y la pauta PDF", "warning");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("notaEncargado", nota);
            formData.append("comentarios", comentarios);
            formData.append("pauta", archivoPauta);

            await evaluarPractica(id, formData);
            Swal.fire("Éxito", "Evaluación registrada correctamente", "success");
            navigate("/dashboard");
        } catch (error) {
            console.error(error); // Aquí usamos la variable para que no marque error
            Swal.fire("Error", "No se pudo guardar la evaluación", "error");
        }
    };

    if (loading) return <div className="p-10 text-center font-medium text-gray-600">Cargando...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Revisión y Evaluación Final</h1>
                <p className="text-gray-600">Califique el desempeño del estudiante basándose en los documentos entregados.</p>
            </header>

            <section className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
                <h2 className="text-xl font-semibold mb-5 flex items-center text-gray-700">
                    <span className="mr-2">📂</span> Documentos del Estudiante
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    <div className="p-5 border-2 border-dashed border-blue-100 rounded-xl bg-blue-50">
                        <p className="font-bold text-blue-800 mb-3">Informe Final de Práctica</p>
                        {detalle?.informeFinal ? (
                            <a href={buildFileUrl(detalle.informeFinal)} target="_blank" rel="noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Ver Documento PDF
                            </a>
                        ) : <p className="text-gray-400">No disponible</p>}
                    </div>

                    <div className="p-5 border-2 border-dashed border-blue-100 rounded-xl bg-blue-50">
                        <p className="font-bold text-blue-800 mb-3">Bitácoras de Actividades</p>
                        {detalle?.bitacoras?.length > 0 ? (
                            <a href={buildFileUrl(detalle.bitacoras[0])} target="_blank" rel="noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Ver Documento PDF (Bitácora 1)
                            </a>
                        ) : <p className="text-gray-400">No disponible</p>}
                    </div>
                </div>
            </section>

            <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 text-gray-700">Registro de Calificación</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nota Encargado</label>
                            <input type="number" step="0.1" min="1" max="7" value={nota} onChange={(e) => setNota(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="1.0 - 7.0" required />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Retroalimentación / Comentarios</label>
                            <textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Ingrese observaciones..." />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pauta de Corrección Firmada (PDF)</label>
                        <input type="file" accept=".pdf" onChange={(e) => setArchivoPauta(e.target.files[0])} required
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-100">
                            Cancelar
                        </button>
                        <button type="submit" className="flex-[2] bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-md">
                            Confirmar y Finalizar Evaluación
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default EvaluacionEncargado;