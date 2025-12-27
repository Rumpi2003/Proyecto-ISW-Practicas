import axios from 'axios';
import cookies from 'js-cookie';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api', 
    withCredentials: true,
});

instance.interceptors.request.use(
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

export default instance;