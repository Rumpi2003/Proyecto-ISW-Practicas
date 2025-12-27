import axios from './root.service.js';

export const getCarreras = async (facultadId) => {
  try {
    if (!facultadId) return [];

    const url = `/carreras?facultadId=${facultadId}`;
    const response = await axios.get(url);
    
    return response.data.data;
  } catch (error) {
    console.error("Error en getCarreras:", error);
    return [];
  }
};