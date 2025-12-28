import axios from './root.service';

/**
 * REQUISITO: Visualizar bitácoras e informe final.
 * Obtiene la información detallada de la práctica del alumno.
 */
export const getDetalleSolicitud = async (id) => {
    try {
        const response = await axios.get(`/solicitudes/${id}`);
        // Retornamos el objeto data que contiene los documentos y notas
        return response.data.data;
    } catch (error) {
        console.error("Error al cargar detalle para evaluación:", error);
        throw error.response?.data || error.message;
    }
};

/**
 * REQUISITO: Calificación y promedio automático.
 * Envía la nota del encargado al endpoint PATCH de solicitudes.
 */
export const evaluarSolicitud = async (id, notaEncargado) => {
    try {
        // Enviamos un objeto con la nota del encargado
        // El backend promediará automáticamente con la del supervisor
        const response = await axios.patch(`/solicitudes/${id}`, { 
            notaEncargado: parseFloat(notaEncargado) 
        });
        return response.data;
    } catch (error) {
        console.error("Error al enviar calificación:", error);
        throw error.response?.data || error.message;
    }
};