import axios from './root.service.js';
//-- (ESTUDIANTE) ---
export const createSolicitud = async (formData) => {
  const response = await axios.post('/solicitudes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getMisSolicitudes = async () => {
  const response = await axios.get('/solicitudes/mis-solicitudes');
  return response.data;
};

export const updateSolicitud = async (id, formData) => {
  const response = await axios.put(`/solicitudes/mis-solicitudes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
// ¿El estudiante tiene alguna solicitud aprobada?
export const getTieneSolicitudAprobada = async () => {
  const response = await axios.get('/solicitudes/mis-solicitudes/aprobada');
  return response.data; // { aprobada: boolean }
};
//-- (ENCARGADO) ---
export async function getAllSolicitudes() {
    try {
        const response = await axios.get('/solicitudes'); 
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al obtener solicitudes');
    }
}

export async function evaluarSolicitud(id, estado, comentarios) {
    try {
        const response = await axios.patch(`/solicitudes/${id}/estado`, { 
            estado, 
            comentarios 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al evaluar solicitud');
    }
}

export async function deleteSolicitud(id) {
    try {
        const response = await axios.delete(`/solicitudes/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al eliminar solicitud');
    }
}