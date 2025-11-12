import axios from './root.service.js';


export async function getSurveyById(id) {
    try {
        const response = await axios.get(`/survey/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}