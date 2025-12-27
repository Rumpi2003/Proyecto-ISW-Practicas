import axios from './root.service.js';

export async function getMyProfile() {
    try {
        const response = await axios.get('/profile/private'); 
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function getSupervisores() {
    try {
        const response = await axios.get('/users/supervisores');
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al obtener supervisores');
    }
}

export async function getEstudiantes() {
    try {
        const response = await axios.get('/users/estudiantes');
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al obtener estudiantes');
    }
}

export default { getMyProfile, getSupervisores, getEstudiantes };