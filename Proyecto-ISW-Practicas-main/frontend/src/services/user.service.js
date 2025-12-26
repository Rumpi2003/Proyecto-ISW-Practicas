import axios from './root.service.js';

// Crear Estudiante
export const createEstudiante = async (data) => {
    try {
        const response = await axios.post('/users/estudiantes', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUsers = async () => {
    try {
        const response = await axios.get('/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Crear Supervisor
export const createSupervisor = async (data) => {
    try {
        const response = await axios.post('/users/supervisores', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Crear Encargado
export const createEncargado = async (data) => {
    try {
        const response = await axios.post('/users/encargados', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Obtener perfil (necesario para HomeEstudiante)
export const getMyProfile = async () => {
    try {
        const response = await axios.get('/users/me');
        return response.data;
    } catch (error) {
        console.error("Error obteniendo perfil:", error);
        return null;
    }
};

// Eliminar al usuario supervisor
export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};