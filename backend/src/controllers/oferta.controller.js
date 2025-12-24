import { createOferta } from "../services/oferta.service.js";
import { handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export class OfertaController {
  async publish(req, res) {
    try {
      const idEncargado = req.user.id; 
      const ofertaData = req.body;

      const oferta = await createOferta(ofertaData, idEncargado);
      handleSuccess(res, 201, "Oferta publicada con éxito", oferta);
    } catch (error) {
      handleErrorServer(res, 500, "Error al publicar oferta", error.message);
    }
  }
}