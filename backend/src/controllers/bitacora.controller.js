import {
  crearBitacora,
  obtenerBitacorasEstudiante,
  obtenerBitacoraPorId,
  obtenerBitacoras,
  actualizarEstadoBitacora,
  eliminarBitacora,
  verificarBitacoraReciente,
  actualizarBitacoraEstudiante,
  eliminarBitacoraEstudiante,
} from "../services/bitacora.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export class BitacoraController {
  // Estudiante: crear bitácora
  async crearBitacora(req, res) {
    try {
      const { descripcion } = req.body;
      const idEstudianteVerificado = req.user.id;
      const archivos = req.files || [];

      if (!descripcion || descripcion.trim().length === 0) {
        return handleErrorClient(res, 400, "La descripción es requerida");
      }

      if (archivos.length === 0) {
        return handleErrorClient(res, 400, "Debes adjuntar al menos un archivo PDF");
      }

      // Verificar si ya subió una bitácora en los últimos 7 días
      const yaSubio = await verificarBitacoraReciente(idEstudianteVerificado);
      if (yaSubio) {
        return handleErrorClient(
          res,
          400,
          "Solo puedes subir una bitácora por semana. Intenta de nuevo en 7 días."
        );
      }

      // Construir URLs de los archivos
      const archivosUrls = archivos.map((file) => {
        return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
      });

      const data = {
        idEstudiante: idEstudianteVerificado,
        descripcion,
        archivos: archivosUrls,
      };

      const nuevaBitacora = await crearBitacora(data);
      handleSuccess(res, 201, "Bitácora subida exitosamente", nuevaBitacora);
    } catch (error) {
      handleErrorServer(res, 500, "Error al crear la bitácora", error.message);
    }
  }

  // Estudiante: obtener sus bitácoras
  async obtenerMisBitacoras(req, res) {
    try {
      const idEstudiante = req.user.id;
      const bitacoras = await obtenerBitacorasEstudiante(idEstudiante);

      handleSuccess(res, 200, "Bitácoras obtenidas", bitacoras);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener bitácoras", error.message);
    }
  }

  // Encargado: obtener todas las bitácoras
  async obtenerTodasLasBitacoras(req, res) {
    try {
      const bitacoras = await obtenerBitacoras();
      handleSuccess(res, 200, "Bitácoras obtenidas", bitacoras);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener bitácoras", error.message);
    }
  }

  // Encargado: obtener bitácora por ID
  async obtenerBitacoraPorId(req, res) {
    try {
      const { idBitacora } = req.params;

      if (!idBitacora || isNaN(idBitacora)) {
        return handleErrorClient(res, 400, "ID de bitácora inválido");
      }

      const bitacora = await obtenerBitacoraPorId(idBitacora);

      if (!bitacora) {
        return handleErrorClient(res, 404, "Bitácora no encontrada");
      }

      handleSuccess(res, 200, "Bitácora obtenida", bitacora);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener bitácora", error.message);
    }
  }

  // Encargado: actualizar estado de bitácora
  async actualizarEstado(req, res) {
    try {
      const { idBitacora } = req.params;
      const { estado, comentarios } = req.body;

      if (!idBitacora || isNaN(idBitacora)) {
        return handleErrorClient(res, 400, "ID de bitácora inválido");
      }

      if (!estado) {
        return handleErrorClient(res, 400, "El estado es requerido");
      }

      if (comentarios && comentarios.length > 1000) {
        return handleErrorClient(res, 400, "El comentario es demasiado largo (máximo 1000 caracteres)");
      }

      const bitacoraActualizada = await actualizarEstadoBitacora(idBitacora, estado, comentarios);
      handleSuccess(res, 200, "Bitácora actualizada", bitacoraActualizada);
    } catch (error) {
      if (error.message.includes("no encontrada") || error.message.includes("no válido")) {
        handleErrorClient(res, 404, error.message);
      } else {
        handleErrorServer(res, 500, "Error al actualizar bitácora", error.message);
      }
    }
  }

  // Encargado: eliminar bitácora
  async eliminarBitacora(req, res) {
    try {
      const { idBitacora } = req.params;

      if (!idBitacora || isNaN(idBitacora)) {
        return handleErrorClient(res, 400, "ID de bitácora inválido");
      }

      await eliminarBitacora(idBitacora);
      handleSuccess(res, 200, "Bitácora eliminada exitosamente");
    } catch (error) {
      if (error.message === "Bitácora no encontrada") {
        handleErrorClient(res, 404, error.message);
      } else {
        handleErrorServer(res, 500, "Error al eliminar bitácora", error.message);
      }
    }
  }

  // Estudiante: actualizar su propia bitácora (reemplazar archivos)
  async actualizarPropia(req, res) {
    try {
      const { idBitacora } = req.params;
      const idEstudiante = req.user.id;
      const archivos = req.files || [];
      const { descripcion } = req.body;

      if (!idBitacora || isNaN(idBitacora)) {
        return handleErrorClient(res, 400, "ID de bitácora inválido");
      }

      if (archivos.length === 0) {
        return handleErrorClient(res, 400, "Debes adjuntar al menos un archivo PDF");
      }

      const archivosUrls = archivos.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);

      const bitacoraActualizada = await actualizarBitacoraEstudiante(
        idBitacora,
        idEstudiante,
        archivosUrls,
        descripcion
      );

      handleSuccess(res, 200, "Bitácora actualizada", bitacoraActualizada);
    } catch (error) {
      if (error.message === "Bitácora no encontrada") {
        return handleErrorClient(res, 404, error.message);
      }
      if (error.message === "No autorizado") {
        return handleErrorClient(res, 403, "No puedes editar esta bitácora");
      }
      if (error.message === "Debes adjuntar al menos un archivo PDF") {
        return handleErrorClient(res, 400, error.message);
      }
      handleErrorServer(res, 500, "Error al actualizar bitácora", error.message);
    }
  }

  // Estudiante: eliminar su propia bitácora
  async eliminarPropia(req, res) {
    try {
      const { idBitacora } = req.params;
      const idEstudiante = req.user.id;

      if (!idBitacora || isNaN(idBitacora)) {
        return handleErrorClient(res, 400, "ID de bitácora inválido");
      }

      await eliminarBitacoraEstudiante(idBitacora, idEstudiante);
      handleSuccess(res, 200, "Bitácora eliminada exitosamente");
    } catch (error) {
      if (error.message === "Bitácora no encontrada") {
        return handleErrorClient(res, 404, error.message);
      }
      if (error.message === "No autorizado") {
        return handleErrorClient(res, 403, "No puedes eliminar esta bitácora");
      }
      handleErrorServer(res, 500, "Error al eliminar bitácora", error.message);
    }
  }
}
