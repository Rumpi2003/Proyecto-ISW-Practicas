import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function DetallePractica() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [detalle, setDetalle] = useState(null);
    const [nota, setNota] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    // Cargar detalles desde el backend
    const cargar = useCallback(async () => {
        try {
            setError("");
            const res = await api.get(`/encargado/practicas/${id}`);
            setDetalle(res.data.data);
        } catch (err) {
            console.error(err);
            setError("Error al cargar el detalle de la práctica");
        }
    }, [id]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    // Enviar evaluación
    const evaluar = async () => {
        setMensaje("");
        setError("");

        const valor = parseFloat(nota);

        if (Number.isNaN(valor) || valor < 1 || valor > 7) {
            setError("La nota debe ser un número entre 1.0 y 7.0");
            return;
        }

        try {
            const res = await api.post(
                `/encargado/practicas/${id}/evaluacion`,
                { nota_encargado: valor }
            );

            setMensaje(`Evaluación guardada. Nota final: ${res.data.data.nota_final}`);
            setNota("");
            cargar();
        } catch (err) {
            console.error(err);
            setError("Error al guardar la evaluación");
        }
    };

    if (!detalle) return <p>Cargando detalle de la práctica...</p>;

    const { practica, bitacoras, informeFinal, evaluacion } = detalle;

    return (
        <div style={{ padding: 20 }}>
            <button onClick={() => navigate(-1)}>← Volver</button>

            <h2>Detalle de Práctica</h2>

            <h3>{practica.estudiante}</h3>
            <p><strong>Empresa:</strong> {practica.empresa}</p>
            <p><strong>Estado:</strong> {practica.estado}</p>

            <h3>Bitácoras</h3>
            {bitacoras.length === 0 ? (
                <p>No hay bitácoras registradas.</p>
            ) : (
                <ul>
                    {bitacoras.map((b) => (
                        <li key={b.id_bitacora}>
                            <strong>{b.fecha}:</strong> {b.resumen}
                        </li>
                    ))}
                </ul>
            )}

            <h3>Informe Final</h3>
            {informeFinal ? (
                <a href={informeFinal.url_pdf} target="_blank" rel="noreferrer">
                    Ver Informe Final
                </a>
            ) : (
                <p>No hay informe final registrado.</p>
            )}

            <h3>Evaluación</h3>
            <p>Nota Supervisor: {evaluacion.nota_supervisor ?? "Sin nota"}</p>
            <p>Nota Encargado: {evaluacion.nota_encargado ?? "Sin evaluar"}</p>
            <p>Nota Final: {evaluacion.nota_final ?? "-"}</p>

            <div style={{ marginTop: 16 }}>
                <label>
                    Nota del Encargado:&nbsp;
                    <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="7"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                    />
                </label>

                <button style={{ marginLeft: 10 }} onClick={evaluar}>
                    Guardar Nota
                </button>
            </div>

            {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}