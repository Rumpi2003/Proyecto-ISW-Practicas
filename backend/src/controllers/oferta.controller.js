import { createOferta } from "../services/oferta.service.js";
import { handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export class OfertaController {
  async publish(req, res) {
    try {
      // El middleware de autenticación ya puso el usuario en req.user
      const idEncargado = req.user.id; 
      const ofertaData = req.body;

      // Validación básica antes de llamar al servicio
      if (!ofertaData.carreras || ofertaData.carreras.length === 0) {
        return handleErrorServer(res, 400, "Error de validación", "Debe seleccionar al menos una carrera.");
      }

      const oferta = await createOferta(ofertaData, idEncargado);
      
      handleSuccess(res, 201, "Oferta publicada con éxito", oferta);
    } catch (error) {
      handleErrorServer(res, 500, "Error al publicar oferta", error.message);
    }
  }
}