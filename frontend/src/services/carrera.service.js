// src/services/carrera.service.js
import axios from './root.service.js'; 

export const getCarreras = async () => {
  try {
    const response = await axios.get('/carreras');
    if (response.status === 200) {
      return response.data.data; // Retorna el array de carreras con sus facultades
    }
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    return [];
  }
};