const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = {
    async get(path) {
        const r = await fetch(`${BASE}${path}`);
        return r.json();
    },
    async put(path, body) {
        const r = await fetch(`${BASE}${path}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        return r.json();
    }
};
