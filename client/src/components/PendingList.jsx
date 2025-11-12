import { useEffect, useState } from "react";
import { api } from "../api";

export default function PendingList({ onPick }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        const res = await api.get("/evaluacion");
        setRows(res?.data ?? []);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium">Pendientes del Encargado</h2>
                <button className="border px-3 py-1" onClick={load} disabled={loading}>
                    {loading ? "Cargando..." : "Actualizar"}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left border-b">
                        <tr>
                            <th className="py-2">ID</th>
                            <th>Práctica</th>
                            <th>Supervisor</th>
                            <th>Encargado</th>
                            <th>Estado</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr><td className="py-3" colSpan={6}>Sin pendientes</td></tr>
                        )}
                        {rows.map((r) => (
                            <tr key={r.id} className="border-b hover:bg-gray-50">
                                <td className="py-2">{r.id}</td>
                                <td>{r.practica_id}</td>
                                <td>{r.nota_supervisor ?? "-"}</td>
                                <td>{r.nota_encargado ?? "-"}</td>
                                <td>{r.estado}</td>
                                <td>
                                    <button className="border px-3 py-1" onClick={() => onPick(r.id)}>
                                        Evaluar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
