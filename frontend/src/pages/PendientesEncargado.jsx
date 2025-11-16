import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function PendientesEncargado() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const cargar = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get("/encargado/practicas/pendientes");
            setLista(res.data.data || []);
        } catch (err) {
            console.error("Error cargando prácticas:", err);
            setError("Error al cargar las prácticas pendientes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    if (loading) return <p>Cargando prácticas pendientes...</p>;

    return (
        <div>
            <h2>Pendientes del Encargado</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {lista.length === 0 ? (
                <p>No hay prácticas pendientes 🎉</p>
            ) : (
                <table
                    style={{
                        marginTop: 20,
                        borderCollapse: "collapse",
                        minWidth: "600px",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ccc", padding: 8 }}>
                                Estudiante
                            </th>
                            <th style={{ border: "1px solid #ccc", padding: 8 }}>
                                Carrera
                            </th>
                            <th style={{ border: "1px solid #ccc", padding: 8 }}>
                                Empresa
                            </th>
                            <th style={{ border: "1px solid #ccc", padding: 8 }}>
                                Estado
                            </th>
                            <th style={{ border: "1px solid #ccc", padding: 8 }}>
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.map((p) => (
                            <tr key={p.id_practica}>
                                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                                    {p.estudiante}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                                    {p.carrera}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                                    {p.empresa}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                                    {p.estado}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                                    <button
                                        onClick={() => navigate(`/practica/${p.id_practica}`)}
                                    >
                                        Revisar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button style={{ marginTop: 16 }} onClick={cargar}>
                Actualizar lista
            </button>
        </div>
    );
}