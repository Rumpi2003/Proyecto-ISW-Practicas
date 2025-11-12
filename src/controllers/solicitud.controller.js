// src/controllers/solicitud.controller.js
import { createSolicitud, findSolicitudes, updateSolicitudEstado, deleteSolicitud } from "../services/solicitud.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

//cuando se crea solicitud
export class SolicitudController {

  async create(req, res) {
    try {
      const { mensaje, documentos } = req.body;
      const idEstudianteVerificado = req.user.sub;
      // Verificamos que vengan todo lo necesario (minimo para valido)
      if (!mensaje) { 
        return handleErrorClient(res, 400, "El mensaje es requerido");
      }

      const data = {
        idEstudiante: idEstudianteVerificado,
        mensaje,
        documentos
      };

      const nuevaSolicitud = await createSolicitud(data);
      handleSuccess(res, 201, "Solicitud creada exitosamente", nuevaSolicitud);
    } catch (error) {
      handleErrorServer(res, 500, "Error al crear la solicitud", error.message);
    }
  }

  //para buscar solictud
  async getAll(req, res) {
    try {
      const solicitudes = await findSolicitudes();
      handleSuccess(res, 200, "Solicitudes obtenidas", solicitudes);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener solicitudes", error.message);
    }
  }

  //actualoizar estado de la solicitud
  async updateEstado(req, res) {
    try {
      const { idSolicitud } = req.params;
      const { estado, comentarios } = req.body;

      if (!idSolicitud || isNaN(idSolicitud)) {
        return handleErrorClient(res, 400, "ID de solicitud inválido");
      }
      if (!estado) {
        return handleErrorClient(res, 400, "El nuevo 'estado' es requerido");
      }

      const solicitudActualizada = await updateSolicitudEstado(idSolicitud, estado, comentarios);
      handleSuccess(res, 200, "Solicitud actualizada", solicitudActualizada);
    } catch (error) {
      if (error.message === "Solicitud no encontrada" || error.message === "Estado no válido") {
        handleErrorClient(res, 404, error.message);
      } else {
        handleErrorServer(res, 500, "Error al actualizar la solicitud", error.message);
      }
    }
  }

  async delete(req, res) {
    try {
      const { idSolicitud } = req.params;

      if (!idSolicitud || isNaN(idSolicitud)) {
        return handleErrorClient(res, 400, "ID de solicitud inválido");
      }

      await deleteSolicitud(idSolicitud);
      handleSuccess(res, 200, "Solicitud eliminada exitosamente");

    } catch (error) {
      if (error.message === "Solicitud no encontrada") {
        handleErrorClient(res, 404, error.message);
      } else {
        handleErrorServer(res, 500, "Error al eliminar la solicitud", error.message);
      }
    }
  }
}