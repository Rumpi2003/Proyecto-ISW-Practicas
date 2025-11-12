import { useEffect, useState } from "react";
import { api } from "../api";

export default function EvaluacionEditor({ id, onBack }) {
    const [item, setItem] = useState(null);
    const [notaEnc, setNotaEnc] = useState("");
    const [notaSup, setNotaSup] = useState("");
    const [msg, setMsg] = useState("");

    const load = async () => {
        const res = await api.get(`/evaluacion/${id}`);
        setItem(res?.data ?? null);
    };
    useEffect(() => {
        let alive = true;
        (async () => {
            const res = await api.get(`/evaluacion/${id}`);
            if (alive) setItem(res?.data ?? null);
        })();
        return () => { alive = false; };
    }, [id]);


    const guardarEncargado = async (e) => {
        e.preventDefault();
        setMsg("");
        const res = await api.put(`/evaluacion/${id}`, { nota_encargado: Number(notaEnc) });
        setMsg(res?.message || "Guardado");
        await load();
    };

    const guardarSupervisor = async (e) => {
        e.preventDefault();
        setMsg("");
        const res = await api.put(`/evaluacion/${id}/supervisor`, { nota_supervisor: Number(notaSup) });
        setMsg(res?.message || "Guardado");
        await load();
    };

    if (!item) return <div className="p-4">Cargando...</div>;

    return (
        <div className="p-4 space-y-4">
            <button className="border px-3 py-1" onClick={onBack}>← Volver</button>
            <h2 className="text-lg font-medium">Evaluación #{id}</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-xl p-4">
                    <h3 className="font-medium mb-2">Encargado</h3>
                    <form onSubmit={guardarEncargado} className="space-y-2">
                        <input className="border p-2 w-full" type="number" step="0.1" min="1" max="7"
                            placeholder="Nota (1.0 - 7.0)" value={notaEnc}
                            onChange={(e) => setNotaEnc(e.target.value)} />
                        <button className="border px-3 py-2">Guardar nota</button>
                    </form>
                </div>
                <div className="border rounded-xl p-4">
                    <h3 className="font-medium mb-2">Supervisor</h3>
                    <form onSubmit={guardarSupervisor} className="space-y-2">
                        <input className="border p-2 w-full" type="number" step="0.1" min="1" max="7"
                            placeholder="Nota (1.0 - 7.0)" value={notaSup}
                            onChange={(e) => setNotaSup(e.target.value)} />
                        <button className="border px-3 py-2">Guardar nota</button>
                    </form>
                </div>
            </div>

            <div className="border rounded-xl p-4">
                <h3 className="font-medium mb-2">Resumen</h3>
                <ul className="text-sm space-y-1">
                    <li><strong>Supervisor:</strong> {item.nota_supervisor ?? "-"}</li>
                    <li><strong>Encargado:</strong> {item.nota_encargado ?? "-"}</li>
                    <li><strong>Promedio final:</strong> {item.nota_final ?? "-"}</li>
                    <li><strong>Estado:</strong> {item.estado}</li>
                </ul>
                {msg && <p className="text-sm mt-2">{msg}</p>}
            </div>
        </div>
    );
}
