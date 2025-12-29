import axios from './root.service.js';
//--- (PERFIL) ---
export async function getMyProfile() {
    try {
        const response = await axios.get('/profile/private'); 
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

//-- (ESTUDIANTES) ---
export async function getEstudiantes() {
    try {
        const response = await axios.get('/users/estudiantes');
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al obtener estudiantes');
    }
}
export async function createEstudiante(data) {
    try {
        const response = await axios.post('/users/estudiantes', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al crear estudiante');
    }
    
}

export async function deleteEstudiante(id) {
    try {
        const response = await axios.delete(`/users/estudiantes/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al eliminar estudiante');
    }
}
//--- (ENCARGADOS) ---
export async function getEncargados() {
    try {
        const response = await axios.get('/users/encargados');
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al obtener encargados');
    }
}

export async function createEncargado(data) {
    try {
        const response = await axios.post('/users/encargados', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al crear encargado');
    }
}

export async function deleteEncargado(id) {
    try {
        const response = await axios.delete(`/users/encargados/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al eliminar encargado');
    }
}

//-- (SUPERVISORES) ---
export async function getSupervisores() {
    try {
        const response = await axios.get('/users/supervisores');
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al obtener supervisores');
    }
}

export async function createSupervisor(data) {
    try {
        const response = await axios.post('/users/supervisores', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al crear supervisor');
    }
}

export async function deleteSupervisor(id) {
    try {
        const response = await axios.delete(`/users/supervisores/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al eliminar supervisor');
    }
}

export default {
    getMyProfile,
    getEstudiantes, createEstudiante, deleteEstudiante,
    getEncargados, createEncargado, deleteEncargado,
    getSupervisores, createSupervisor, deleteSupervisor
};