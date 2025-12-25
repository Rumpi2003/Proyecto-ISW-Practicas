import { createOferta, getOfertas } from "../services/oferta.service.js"; // 👈 Importamos la nueva función del servicio
import { handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export class OfertaController {
  
  // 1. PUBLICAR OFERTA (POST)
  async publish(req, res) {
    try {
      const idEncargado = req.user.id; 
      const ofertaData = req.body;

      if (!ofertaData.carreras || ofertaData.carreras.length === 0) {
        return handleErrorServer(res, 400, "Error de validación", "Debe seleccionar al menos una carrera.");
      }

      const oferta = await createOferta(ofertaData, idEncargado);
      
      handleSuccess(res, 201, "Oferta publicada con éxito", oferta);
    } catch (error) {
      handleErrorServer(res, 500, "Error al publicar oferta", error.message);
    }
  }

  // 2. OBTENER OFERTAS (GET) - 👇 ESTO FALTABA
  async getOffers(req, res) {
    try {
      // Llamamos al servicio para que busque en la BD
      const ofertas = await getOfertas();
      
      handleSuccess(res, 200, "Ofertas obtenidas exitosamente", ofertas);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener las ofertas", error.message);
    }
  }
}