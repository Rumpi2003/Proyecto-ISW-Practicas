import axios from './root.service';

export const getSolicitudes = async () => {
    try {
        const response = await axios.get('/solicitudes');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error al obtener solicitudes" };
    }
};

export const createSolicitud = async (solicitudData) => {
    try {
        const response = await axios.post('/solicitudes', solicitudData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error al crear la solicitud" };
    }
};

export const updateSolicitud = async (idSolicitud, data) => {
    try {
        const response = await axios.patch(`/solicitudes/${idSolicitud}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error al actualizar la solicitud" };
    }
};

export const updateEstadoSolicitud = async (idSolicitud, estado, comentarios) => {
    try {
        const response = await axios.patch(`/solicitudes/${idSolicitud}`, { estado, comentarios });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error al actualizar estado" };
    }
};