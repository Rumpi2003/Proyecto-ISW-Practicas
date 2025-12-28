import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetalleSolicitud, evaluarSolicitud } from '../services/evaluacion.service';
import Swal from 'sweetalert2';

const Evaluacion = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados
    const [solicitud, setSolicitud] = useState(null);
    const [nota, setNota] = useState("");
    const [urlPauta, setUrlPauta] = useState("");
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const data = await getDetalleSolicitud(id);
                setSolicitud(data);
                if (data.evaluacion?.urlPauta) {
                    setUrlPauta(data.evaluacion.urlPauta);
                    setFileName("Pauta cargada previamente");
                }
            } catch (error) {
                console.error("Error al cargar:", error);
                Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [id]);

    // Función para convertir el archivo a Texto (Base64)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                Swal.fire("Error", "Solo se permiten archivos PDF", "error");
                e.target.value = null; // Limpiar input
                return;
            }

            // Convertir a Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setUrlPauta(reader.result);
                setFileName(file.name);
            };
            reader.onerror = (error) => {
                console.error("Error al leer el archivo:", error);
                Swal.fire("Error", "No se pudo leer el archivo", "error");
            };
        }
    };

    const handleGuardarNota = async (e) => {
        e.preventDefault();
        try {
            await evaluarSolicitud(id, {
                notaEncargado: parseFloat(nota),
                urlPauta: urlPauta
            });

            Swal.fire({
                title: '¡Evaluación Guardada!',
                text: 'La nota y la pauta PDF se han registrado correctamente.',
                icon: 'success',
                confirmButtonColor: '#4f46e5'
            });

            navigate('/encargado/practicas');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || "No se pudo guardar", 'error');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Cargando... ⏳</p>
            </div>
        </div>
    );

    if (!solicitud) return <div className="text-center p-10 text-red-500">Solicitud no encontrada</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Evaluación de Práctica</h1>
                    <p className="text-gray-500">Revisa antecedentes y asigna calificación.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* DATOS ALUMNO */}
                    <section className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">👤 Datos Estudiante</h3>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Nombre:</strong> {solicitud.estudiante?.nombre}</p>
                            <p><strong>RUT:</strong> {solicitud.estudiante?.rut}</p>
                            <p><strong>Carrera:</strong> {solicitud.estudiante?.carrera}</p>
                        </div>
                    </section>

                    {/* ESTADO NOTAS */}
                    <section className="bg-green-50 p-6 rounded-xl border border-green-100">
                        <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">📊 Calificación</h3>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Nota Supervisor:</strong> <span className="ml-2 bg-green-200 text-green-800 px-2 rounded-full font-bold">{solicitud.notaSupervisor || "Pendiente"}</span></p>
                            <p><strong>Promedio:</strong> <span className="ml-2 font-bold text-indigo-600">{solicitud.notaFinal || "-"}</span></p>
                        </div>
                    </section>
                </div>

                <form onSubmit={handleGuardarNota} className="border-t border-gray-100 pt-8">
                    <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 space-y-6">

                        {/* INPUT PARA SUBIR ARCHIVO PDF */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">
                                Subir Pauta de Evaluación (PDF):
                            </label>

                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-all">
                                    <span>📂 Seleccionar Archivo</span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-gray-500 italic text-sm">
                                    {fileName || "Ningún archivo seleccionado"}
                                </span>
                            </div>

                            {/* Vista previa si ya existe */}
                            {urlPauta && (
                                <div className="mt-2">
                                    <a href={urlPauta} download="Pauta_Evaluacion.pdf" className="text-sm text-indigo-600 underline hover:text-indigo-800">
                                        📄 Ver Pauta Cargada
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* INPUT NOTA */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-4 text-lg">Asignar Nota Encargado:</label>
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <input
                                    type="number" step="0.1" min="1.0" max="7.0"
                                    value={nota} onChange={(e) => setNota(e.target.value)}
                                    className="border-2 border-gray-200 rounded-xl px-5 py-3 w-full md:w-40 text-2xl font-bold text-center focus:border-indigo-500 outline-none"
                                    placeholder="0.0" required
                                />
                                <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2">
                                    <span>💾</span> Guardar Todo
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <footer className="mt-8 flex justify-center">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition-colors font-medium">
                        ← Cancelar y volver
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default Evaluacion;