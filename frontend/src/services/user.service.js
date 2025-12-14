import axios from './root.service.js';

export async function getMyProfile() {
    try {
        //ruta protegida
        const response = await axios.get('/profile/private'); 
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}