import Cookies from 'js-cookie';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function createPauta(data) {
  const token = Cookies.get('jwt-auth');
  if (!token) {
    throw new Error('No se encontró token de autenticación. Inicia sesión.');
  }

  const resp = await fetch(`${API_BASE}/api/pautas-evaluacion`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const json = await resp.json().catch(() => null);
  if (!resp.ok) {
    throw new Error((json && json.message) || resp.statusText || 'Error al crear pauta');
  }
  return json;
}

export default { createPauta };

export async function getPautas() {
  const token = Cookies.get('jwt-auth');
  if (!token) {
    throw new Error('No se encontró token de autenticación. Inicia sesión.');
  }

  const resp = await fetch(`${API_BASE}/api/pautas-evaluacion`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((json && json.message) || resp.statusText || 'Error al obtener pautas');
  return json;
}

export async function deletePauta(id) {
  const token = Cookies.get('jwt-auth');
  if (!token) {
    throw new Error('No se encontró token de autenticación. Inicia sesión.');
  }

  const resp = await fetch(`${API_BASE}/api/pautas-evaluacion/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((json && json.message) || resp.statusText || 'Error al eliminar pauta');
  return json;
}

export async function getPautaById(id) {
  const token = Cookies.get('jwt-auth');
  if (!token) throw new Error('No se encontró token de autenticación. Inicia sesión.');

  const resp = await fetch(`${API_BASE}/api/pautas-evaluacion/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((json && json.message) || resp.statusText || 'Error al obtener la pauta');
  return json;
}

export async function updatePauta(id, data) {
  const token = Cookies.get('jwt-auth');
  if (!token) throw new Error('No se encontró token de autenticación. Inicia sesión.');

  const resp = await fetch(`${API_BASE}/api/pautas-evaluacion/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  const json = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((json && json.message) || resp.statusText || 'Error al actualizar la pauta');
  return json;
}
