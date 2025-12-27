import axios from './root.service.js';
import cookies from 'js-cookie';

export async function login(dataUser) {
    try {
        const response = await axios.post('/auth/login', {
            email: dataUser.email,
            password: dataUser.password
        });

        const { token, user, message } = response.data;

        if (!token) {
            throw new Error(message || "Error: No se recibió el token de autenticación.");
        }

        // Configuración de persistencia de sesión
        cookies.set('jwt-auth', token, { path: '/' });
        sessionStorage.setItem('usuario', JSON.stringify(user));

        return response.data; 

    } catch (error) {
        console.error("Auth Service Error:", error);
        throw error.response?.data || { message: "Error de conexión con el servidor" };
    }
}

export async function logout() {
    sessionStorage.removeItem('usuario');
    cookies.remove('jwt-auth');
    window.location.href = '/';
}