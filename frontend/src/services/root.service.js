// frontend/src/services/root.service.js
import axios from 'axios';

// URL base .env
const baseURL = import.meta.env.VITE_BASE_URL;

const rootService = axios.create({
  baseURL
});

export default rootService;