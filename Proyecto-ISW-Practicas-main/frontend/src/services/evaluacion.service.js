import axios from './root.service';

// 1. Obtener la lista de estudiantes pendientes
export const getPendientes = async () => {
    try {
        const response = await axios.get('/encargado/pendientes');
        const { status, data } = response.data;
        if (status === 'Success') {
            return data;
        }
    } catch (error) {
        console.error("Error al obtener pendientes:", error);
        throw error;
    }
};

// 2. Obtener el detalle de una solicitud específica
export const getDetalleSolicitud = async (id) => {
    try {
        const response = await axios.get(`/encargado/${id}`);
        const { status, data } = response.data;
        if (status === 'Success') {
            return data;
        }
    } catch (error) {
        console.error("Error al obtener detalle:", error);
        throw error;
    }
};

// 3. Enviar la evaluación (Nota)
export const evaluarSolicitud = async (id, nota) => {
    try {
        // El backend espera { "nota": valor }
        const response = await axios.post(`/encargado/${id}/evaluar`, { nota });
        return response.data;
    } catch (error) {
        console.error("Error al evaluar:", error);
        throw error;
    }
};