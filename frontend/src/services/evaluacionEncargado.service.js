import axios from './root.service.js';

// 1. Obtener la lista de estudiantes pendientes de evaluación
export const getPendientes = async () => {
    const response = await axios.get('/encargado/pendientes');
    return response.data;
};

// 2. Obtener el detalle de una práctica (Datos del alumno + Links de archivos)
export const getDetallePractica = async (id) => {
    const response = await axios.get(`/encargado/detalle/${id}`);
    return response.data;
};

// 3. Evaluar la práctica (Envía nota, comentarios y el archivo PDF)
export const evaluarPractica = async (id, formData) => {
    // Es CRÍTICO usar 'multipart/form-data' cuando enviamos archivos
    const response = await axios.post(`/encargado/evaluar/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// 4. Obtener el historial de evaluaciones pasadas
export const getHistorial = async () => {
    const response = await axios.get('/encargado/historial');
    return response.data;
};