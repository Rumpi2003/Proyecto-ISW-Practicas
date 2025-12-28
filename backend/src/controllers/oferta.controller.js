import { createOferta, getOfertas, updateOferta, deleteOferta } from "../services/oferta.service.js";
import { handleSuccess, handleErrorServer, handleErrorClient } from "../handlers/responseHandlers.js";

export class OfertaController {
  
  // 1. PUBLICAR OFERTA (POST)
  async publish(req, res) {
    try {
      const idEncargado = req.user.id; 
      const ofertaData = req.body;

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

      if (!id) return handleErrorClient(res, 400, "Error", "ID de oferta requerido");

      const ofertaActualizada = await updateOferta(id, ofertaData);
      
      if (!ofertaActualizada) {
        return handleErrorClient(res, 404, "Oferta no encontrada", "No se pudo actualizar la oferta porque no existe.");
      }
      
      handleSuccess(res, 200, "Oferta actualizada con éxito", ofertaActualizada);
    } catch (error) {
      handleErrorServer(res, 500, "Error al actualizar la oferta", error.message);
    }
  }

  // 4. ELIMINAR OFERTA (DELETE) (NUEVO)
  async delete(req, res) {
    try {
      const { id } = req.params;

      const ofertaEliminada = await deleteOferta(id);

      if (!ofertaEliminada) {
        return handleErrorClient(res, 404, "Error", "La oferta no existe.");
      }

      handleSuccess(res, 200, "Oferta eliminada con éxito", ofertaEliminada);
    } catch (error) {
      handleErrorServer(res, 500, "Error al eliminar la oferta", error.message);
    }
  }
}