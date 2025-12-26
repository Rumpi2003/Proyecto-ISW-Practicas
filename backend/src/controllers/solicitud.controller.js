// src/controllers/solicitud.controller.js
import { createSolicitud, findSolicitudes, updateSolicitudEstado, deleteSolicitud, getSolicitudesEstudiante, updateSolicitudEstudiante } from "../services/solicitud.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

//cuando se crea solicitud
export class SolicitudController {

  async create(req, res) {
    try {
      const { mensaje, documentos } = req.body;
      const idEstudianteVerificado = req.user.id;

      // --- AGREGA ESTO PARA DEPURAR ---
      console.log("Token decodificado (req.user):", req.user);
      console.log("ID extraído:", idEstudianteVerificado);
      // -------------------------------

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

  async getSolicitudesEstudiante(req, res) {
    try {
      //ID del estudiante desde el token 
      const idEstudiante = req.user.id;

      const solicitudes = await getSolicitudesEstudiante(idEstudiante);
      
      if (!solicitudes || solicitudes.length === 0) {
         return handleSuccess(res, 200, "No tienes solicitudes creadas", []);
      }

      handleSuccess(res, 200, "Mis solicitudes obtenidas", solicitudes);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener tus solicitudes", error.message);
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

  async updatePropia(req, res) {
    try {
      const { idSolicitud } = req.params;
      const { mensaje, documentos } = req.body;
      const idEstudiante = req.user.id;

      if (!idSolicitud) return handleErrorClient(res, 400, "Falta el ID");

      if (!mensaje && !documentos) {
         return handleErrorClient(res, 400, "Sin datos para actualizar");
      }

      const solicitudActualizada = await updateSolicitudEstudiante(idSolicitud, idEstudiante, { mensaje, documentos });
      
      handleSuccess(res, 200, "Solicitud corregida y enviada a revisión nuevamente", solicitudActualizada);

    } catch (error) {
      if (error.message === "Solicitud no encontrada") {
        return handleErrorClient(res, 404, "La solicitud no existe");
      }
      if (error.message === "No autorizado") {
        return handleErrorClient(res, 403, "No puedes editar esta solicitud");
      }
      if (error.message === "Ya aprobada") {
        return handleErrorClient(res, 400, "No puedes editar una solicitud que ya fue Aprobada.");
      }
      
      handleErrorServer(res, 500, "Error al actualizar", error.message);
    }
  }
}