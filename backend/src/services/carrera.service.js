import axios from './root.service.js';

export const getCarreras = async (facultadId) => {
  try {
    // 1. SI NO HAY ID, DEVUELVE VACÍO (No molesta al backend)
    if (!facultadId) {
        console.warn("⛔ [Service] ID vacío. No se hará petición.");
        return [];
    }

    // 2. CONCATENACIÓN MANUAL EXPLICITA
    const url = `/carreras?facultadId=${facultadId}`;
    
    // 3. LOG CHIVATO: Este mensaje DEBE aparecer en tu navegador
    console.log("🔥 [Service] URL FINAL:", url);

    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error en getCarreras:", error);
    return [];
  }
};