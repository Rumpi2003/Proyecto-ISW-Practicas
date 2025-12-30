// src/controllers/solicitud.controller.js
import { createSolicitud, findSolicitudes, updateSolicitudEstado, deleteSolicitud, getSolicitudesEstudiante, updateSolicitudEstudiante, hasApprovedSolicitud } from "../services/solicitud.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { validateCreateSolicitud, validateUpdateEstadoSolicitud, validateUpdateSolicitudEstudiante } from "../validations/solicitud.validation.js";
export class SolicitudController {

  async create(req, res) {
    try {
      const { error, value } = validateCreateSolicitud(req.body);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const file = req.file;
      const idEstudianteVerificado = req.user.id;
      const { mensaje } = value;

      if (!file) {
        return handleErrorClient(res, 400, "Debes adjuntar un archivo PDF obligatorio.");
      }

      let documentosUrls = [];
      if (file) {
        const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        documentosUrls.push(url);
      }

      const data = {
        idEstudiante: idEstudianteVerificado,
        mensaje,
        documentos: documentosUrls
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

      if (!idSolicitud || isNaN(idSolicitud)) {
        return handleErrorClient(res, 400, "ID de solicitud inválido");
      }

      const { error, value } = validateUpdateEstadoSolicitud(req.body);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const { estado, comentarios } = value;

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

      const { error, value } = validateUpdateSolicitudEstudiante(req.body);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const { mensaje } = value;
      const idEstudiante = req.user.id;
      const file = req.file;

      if (!idSolicitud) return handleErrorClient(res, 400, "Falta el ID");

      let documentosUrls = undefined;
      if (file) {
        const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        documentosUrls = [url];
      }

      if (!mensaje && !file) {
        return handleErrorClient(res, 400, "Sin datos para actualizar");
      }

      const solicitudActualizada = await updateSolicitudEstudiante(
        idSolicitud,
        idEstudiante,
        {
          mensaje,
          documentos: documentosUrls
        }
      );

      handleSuccess(res, 200, "Solicitud corregida y enviada a revisión nuevamente", solicitudActualizada);

    } catch (error) {
      if (error.message === "Solicitud no encontrada") return handleErrorClient(res, 404, "La solicitud no existe");
      if (error.message === "No autorizado") return handleErrorClient(res, 403, "No puedes editar esta solicitud");
      if (error.message === "Ya aprobada") return handleErrorClient(res, 400, "No puedes editar una solicitud que ya fue Aprobada.");

      handleErrorServer(res, 500, "Error al actualizar", error.message);
    }
  }

  // boolean: ¿tengo alguna solicitud aprobada?
  async hasAprobada(req, res) {
    try {
      const idEstudiante = req.user.id;
      const aprobada = await hasApprovedSolicitud(idEstudiante);
      handleSuccess(res, 200, "Estado de aprobación", { aprobada });
    } catch (error) {
      handleErrorServer(res, 500, "Error al verificar aprobación", error.message);
    }
  }
}