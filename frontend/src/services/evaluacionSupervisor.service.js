import Cookies from 'js-cookie';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getEvaluacionesSupervisor() {
  const token = Cookies.get('jwt-auth');
  if (!token) throw new Error('No se encontró token de autenticación. Inicia sesión.');

  const resp = await fetch(`${API_BASE}/api/evaluaciones-supervisor`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((json && json.message) || resp.statusText || 'Error al obtener evaluaciones');
  return json;
}

export async function deleteEvaluacionSupervisor(id) {
  const token = Cookies.get('jwt-auth');
  if (!token) throw new Error('No se encontró token de autenticación. Inicia sesión.');

  const resp = await fetch(`${API_BASE}/api/evaluaciones-supervisor/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((json && json.message) || resp.statusText || 'Error al eliminar evaluación');
  return json;
}

export default { getEvaluacionesSupervisor, deleteEvaluacionSupervisor };

export async function createEvaluacionSupervisor(data) {
  const token = Cookies.get('jwt-auth');
  if (!token) throw new Error('No se encontró token de autenticación. Inicia sesión.');

  const resp = await fetch(`${API_BASE}/api/evaluaciones-supervisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  const json = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((json && json.message) || resp.statusText || 'Error al crear evaluación');
  return json;
}
