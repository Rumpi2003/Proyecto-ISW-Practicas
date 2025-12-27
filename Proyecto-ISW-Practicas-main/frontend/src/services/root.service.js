import axios from 'axios';
import cookies from 'js-cookie';

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const rootService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

rootService.interceptors.request.use(
  (config) => {
    const token = cookies.get('jwt-auth');
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