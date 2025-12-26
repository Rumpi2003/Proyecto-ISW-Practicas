import { createOferta, getOfertas, updateOferta } from "../services/oferta.service.js";
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

  // 2. OBTENER OFERTAS (GET)
  async getOffers(req, res) {
    try {
      const ofertas = await getOfertas();
      handleSuccess(res, 200, "Ofertas obtenidas exitosamente", ofertas);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener las ofertas", error.message);
    }
  }

  // 3. ACTUALIZAR OFERTA (PUT) 👇 NUEVO MÉTODO
  async update(req, res) {
    try {
      const { id } = req.params; // Obtenemos el ID de la URL
      const ofertaData = req.body;

      // Llamamos al servicio de actualización
      const ofertaActualizada = await updateOferta(id, ofertaData);
      
      handleSuccess(res, 200, "Oferta actualizada con éxito", ofertaActualizada);
    } catch (error) {
      // Manejamos errores específicos (como que no exista la oferta o errores de validación)
      handleErrorServer(res, 500, "Error al actualizar la oferta", error.message);
    }
  }
}