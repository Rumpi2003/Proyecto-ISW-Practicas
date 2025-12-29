import {
  crearInforme,
  obtenerInformesEstudiante,
  obtenerInformePorId,
  obtenerInformes,
  actualizarEstadoInforme,
  eliminarInforme,
  actualizarInformeEstudiante,
  eliminarInformeEstudiante,
} from "../services/informe.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export class InformeController {
  // Estudiante: crear informe
  async crearInforme(req, res) {
    try {
      const { descripcion } = req.body;
      const idEstudianteVerificado = req.user.id;
      const archivo = req.file;

      if (!descripcion || descripcion.trim().length === 0) {
        return handleErrorClient(res, 400, "La descripción es requerida");
      }

      if (!archivo) {
        return handleErrorClient(res, 400, "Debes adjuntar un archivo PDF");
      }

      // Construir URL del archivo
      const archivoUrl = `${req.protocol}://${req.get("host")}/uploads/${archivo.filename}`;

      const data = {
        idEstudiante: idEstudianteVerificado,
        descripcion,
        archivo: archivoUrl,
      };

      const nuevoInforme = await crearInforme(data);
      handleSuccess(res, 201, "Informe subido exitosamente", nuevoInforme);
    } catch (error) {
      handleErrorServer(res, 500, "Error al crear el informe", error.message);
    }
  }

  // Estudiante: obtener sus informes
  async obtenerMisInformes(req, res) {
    try {
      const idEstudiante = req.user.id;
      const informes = await obtenerInformesEstudiante(idEstudiante);

      handleSuccess(res, 200, "Informes obtenidos", informes);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener informes", error.message);
    }
  }

  // Encargado: obtener todos los informes
  async obtenerTodosLosInformes(req, res) {
    try {
      const informes = await obtenerInformes();
      handleSuccess(res, 200, "Informes obtenidos", informes);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener informes", error.message);
    }
  }

  // Encargado: obtener informe por ID
  async obtenerInformePorId(req, res) {
    try {
      const { idInforme } = req.params;

      if (!idInforme || isNaN(idInforme)) {
        return handleErrorClient(res, 400, "ID de informe inválido");
      }

      const informe = await obtenerInformePorId(idInforme);

      if (!informe) {
        return handleErrorClient(res, 404, "Informe no encontrado");
      }

      handleSuccess(res, 200, "Informe obtenido", informe);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener informe", error.message);
    }
  }

  // Encargado: actualizar estado de informe
  async actualizarEstado(req, res) {
    try {
      const { idInforme } = req.params;
      const { estado, comentarios } = req.body;

      if (!idInforme || isNaN(idInforme)) {
        return handleErrorClient(res, 400, "ID de informe inválido");
      }

      if (!estado) {
        return handleErrorClient(res, 400, "El estado es requerido");
      }

      if (comentarios && comentarios.length > 1000) {
        return handleErrorClient(res, 400, "El comentario es demasiado largo (máximo 1000 caracteres)");
      }

      const informeActualizado = await actualizarEstadoInforme(idInforme, estado, comentarios);
      handleSuccess(res, 200, "Informe actualizado", informeActualizado);
    } catch (error) {
      if (error.message.includes("no encontrado") || error.message.includes("no válido")) {
        handleErrorClient(res, 404, error.message);
      } else {
        handleErrorServer(res, 500, "Error al actualizar informe", error.message);
      }
    }
  }

  // Encargado: eliminar informe
  async eliminarInforme(req, res) {
    try {
      const { idInforme } = req.params;

      if (!idInforme || isNaN(idInforme)) {
        return handleErrorClient(res, 400, "ID de informe inválido");
      }

      await eliminarInforme(idInforme);
      handleSuccess(res, 200, "Informe eliminado exitosamente");
    } catch (error) {
      if (error.message === "Informe no encontrado") {
        handleErrorClient(res, 404, error.message);
      } else {
        handleErrorServer(res, 500, "Error al eliminar informe", error.message);
      }
    }
  }

  // Estudiante: actualizar su propio informe (reemplazar archivo)
  async actualizarPropio(req, res) {
    try {
      const { idInforme } = req.params;
      const idEstudiante = req.user.id;
      const archivo = req.file;
      const { descripcion } = req.body;

      if (!idInforme || isNaN(idInforme)) {
        return handleErrorClient(res, 400, "ID de informe inválido");
      }

      if (!archivo) {
        return handleErrorClient(res, 400, "Debes adjuntar un archivo PDF");
      }

      const archivoUrl = `${req.protocol}://${req.get("host")}/uploads/${archivo.filename}`;

      const informeActualizado = await actualizarInformeEstudiante(
        idInforme,
        idEstudiante,
        archivoUrl,
        descripcion
      );

      handleSuccess(res, 200, "Informe actualizado", informeActualizado);
    } catch (error) {
      if (error.message === "Informe no encontrado") {
        return handleErrorClient(res, 404, error.message);
      }
      if (error.message === "No autorizado") {
        return handleErrorClient(res, 403, "No puedes editar este informe");
      }
      if (error.message.includes("aprobado")) {
        return handleErrorClient(res, 400, error.message);
      }
      handleErrorServer(res, 500, "Error al actualizar informe", error.message);
    }
  }

  // Estudiante: eliminar su propio informe
  async eliminarPropio(req, res) {
    try {
      const { idInforme } = req.params;
      const idEstudiante = req.user.id;

      if (!idInforme || isNaN(idInforme)) {
        return handleErrorClient(res, 400, "ID de informe inválido");
      }

      await eliminarInformeEstudiante(idInforme, idEstudiante);
      handleSuccess(res, 200, "Informe eliminado exitosamente");
    } catch (error) {
      if (error.message === "Informe no encontrado") {
        return handleErrorClient(res, 404, error.message);
      }
      if (error.message === "No autorizado") {
        return handleErrorClient(res, 403, "No puedes eliminar este informe");
      }
      if (error.message.includes("aprobado")) {
        return handleErrorClient(res, 400, error.message);
      }
      handleErrorServer(res, 500, "Error al eliminar informe", error.message);
    }
  }
}
