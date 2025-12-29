// frontend/src/services/root.service.js
import axios from 'axios';
import cookies from 'js-cookie';

// URL base .env
const baseURL = import.meta.env.VITE_BASE_URL;

const rootService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

rootService.interceptors.request.use(
  (config) => {
    //lee el token de la cookie
    const token = cookies.get('jwt-auth');
    
    //agrega a la cabecera Authorization si existe
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default rootService;