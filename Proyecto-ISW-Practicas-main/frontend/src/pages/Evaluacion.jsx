import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetalleSolicitud, evaluarSolicitud } from '../services/evaluacion.service';
import Swal from 'sweetalert2'; // Si no tienes sweetalert, cambia las alertas por alert() normal

const Evaluacion = () => {
    const { id } = useParams(); // Recuperamos el ID de la URL
    const navigate = useNavigate();
    const [solicitud, setSolicitud] = useState(null);
    const [nota, setNota] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const data = await getDetalleSolicitud(id);
                setSolicitud(data);
            } catch (error) {
                console.error("Error al cargar:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [id]);

    const handleGuardarNota = async (e) => {
        e.preventDefault();
        try {
            await evaluarSolicitud(id, nota);
            // Mensaje de éxito
            alert("¡Evaluación guardada exitosamente!"); 
            navigate('/encargado/solicitudes'); // Volver a la lista
        } catch (error) {
            console.error(error);
            alert("Error: " + (error.response?.data?.message || "No se pudo guardar"));
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando información... ⏳</div>;
    if (!solicitud) return <div className="p-10 text-center text-red-500">No se encontró la solicitud </div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                
                {/* ENCABEZADO */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Evaluación de Práctica</h1>
                <p className="text-gray-500 mb-8">Revisa los antecedentes y asigna la calificación final.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* DATOS DEL ESTUDIANTE */}
                    <div className="bg-indigo-50 p-6 rounded-xl">
                        <h3 className="font-bold text-indigo-800 mb-4">👤 Datos del Estudiante</h3>
                        <p><strong>Nombre:</strong> {solicitud.estudiante.nombre}</p>
                        <p><strong>RUT:</strong> {solicitud.estudiante.rut}</p>
                        <p><strong>Carrera:</strong> {solicitud.estudiante.carrera}</p>
                    </div>

                    {/* NOTAS Y ESTADO */}
                    <div className="bg-green-50 p-6 rounded-xl">
                        <h3 className="font-bold text-green-800 mb-4">📊 Estado Actual</h3>
                        <p><strong>Nota Supervisor:</strong> <span className="text-xl font-bold ml-2">{solicitud.notas.supervisor}</span></p>
                        <p className="mt-2 text-sm text-gray-600">Fecha límite: {new Date(solicitud.fechaLimite).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* FORMULARIO DE NOTA */}
                <form onSubmit={handleGuardarNota} className="border-t pt-8">
                    <label className="block text-gray-700 font-bold mb-2">
                        Nota del Encargado (1.0 - 7.0):
                    </label>
                    <div className="flex gap-4 items-center">
                        <input 
                            type="number" 
                            step="0.1" 
                            min="1.0" 
                            max="7.0"
                            value={nota}
                            onChange={(e) => setNota(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3 w-32 text-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Ej: 6.5"
                            required
                        />
                        <button 
                            type="submit"
                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md"
                        >
                            💾 Guardar Evaluación
                        </button>
                    </div>
                </form>

                <button onClick={() => navigate(-1)} className="mt-8 text-gray-500 hover:text-gray-700 underline">
                    Cancelar y volver
                </button>
            </div>
        </div>
    );
};

export default Evaluacion;