import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getPendientes } from "@services/evaluacionEncargado.service";

const PracticasPendientes = () => {
    const navigate = useNavigate();
    const [pendientes, setPendientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await getPendientes();
                const data = res?.data ?? res ?? [];
                setPendientes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudieron cargar las prácticas pendientes a evaluar.", "error");
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-7xl mx-auto flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-white px-4 py-2 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 shadow-sm transition-all"
                >
                    ← Volver
                </button>

                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">📌 Prácticas Pendientes</h1>
                    <p className="text-gray-500">
                        Revisa bitácoras e informe final, y registra la nota final del estudiante.
                    </p>
                </div>

                <div className="ml-auto bg-white px-4 py-2 rounded-full shadow-sm border">
                    <span className="font-bold text-indigo-600">{pendientes.length}</span> pendientes
                </div>
            </div>

            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Cargando...</div>
                ) : pendientes.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        🎉 No hay prácticas pendientes por evaluar.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-indigo-50 text-indigo-900 text-sm border-b">
                                <tr>
                                    <th className="p-5 font-bold">Estudiante</th>
                                    <th className="p-5 font-bold">Rut</th>
                                    <th className="p-5 font-bold">Estado</th>
                                    <th className="p-5 font-bold">Fecha envío</th>
                                    <th className="p-5 font-bold text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {pendientes.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-5 font-semibold text-gray-800">
                                            {s.estudiante?.nombre || "Estudiante"}
                                            <div className="text-xs text-gray-400 font-normal mt-1">
                                                {s.estudiante?.email || ""}
                                            </div>
                                        </td>
                                        <td className="p-5">{s.estudiante?.rut || "-"}</td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                {s.estado || "pendiente_evaluacion"}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-gray-500">
                                            {s.fechaEnvio ? new Date(s.fechaEnvio).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => navigate(`/encargado/evaluar/${s.id}`)}
                                                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-transform transform hover:scale-105"
                                            >
                                                Evaluar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PracticasPendientes;
