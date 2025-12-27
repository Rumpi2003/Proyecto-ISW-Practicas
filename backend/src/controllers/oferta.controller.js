import { createOferta, getOfertas, updateOferta } from "../services/oferta.service.js";
import { handleSuccess, handleErrorServer, handleErrorClient } from "../handlers/responseHandlers.js";

export class OfertaController {
  
  // 1. PUBLICAR OFERTA (POST)
  async publish(req, res) {
    try {
      const idEncargado = req.user.id; 
      const ofertaData = req.body;

      // Validaciones básicas antes de llamar al servicio
      if (!ofertaData.carreras || ofertaData.carreras.length === 0) {
        return handleErrorClient(res, 400, "Error de validación", "Debe seleccionar al menos una carrera.");
      }

      if (!ofertaData.fechaCierre) {
        return handleErrorClient(res, 400, "Error de validación", "La fecha de cierre es obligatoria.");
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
      // Pasamos los query params (filtros) al servicio
      // Esto permite hacer: /api/ofertas?estado=activa
      const filters = req.query; 
      
      const ofertas = await getOfertas(filters);
      handleSuccess(res, 200, "Ofertas obtenidas exitosamente", ofertas);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener las ofertas", error.message);
    }
  }

  // 3. ACTUALIZAR OFERTA (PUT)
  async update(req, res) {
    try {
      const { id } = req.params;
      const ofertaData = req.body;

      // Validación de ID
      if (!id) return handleErrorClient(res, 400, "Error", "ID de oferta requerido");

      const ofertaActualizada = await updateOferta(id, ofertaData);
      
      // Si el servicio retorna null/undefined, es porque no encontró la oferta
      if (!ofertaActualizada) {
        return handleErrorClient(res, 404, "Oferta no encontrada", "No se pudo actualizar la oferta porque no existe.");
      }
      
      handleSuccess(res, 200, "Oferta actualizada con éxito", ofertaActualizada);
    } catch (error) {
      handleErrorServer(res, 500, "Error al actualizar la oferta", error.message);
    }
  }
}