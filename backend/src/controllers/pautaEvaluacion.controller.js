import { createPautaEvaluacion, findPautasEvaluacion, findPautaEvaluacionById, updatePautaEvaluacion, deletePautaEvaluacion } from "../services/pautaEvaluacion.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { validateCreatePauta, validateUpdatePauta } from "../validations/pautaEvaluacion.validation.js";

export class PautaEvaluacionController {

  // Crear una nueva pauta de evaluación
  async create(req, res) {
    try {
      // Validar datos con Joi
      const { error, value } = validateCreatePauta(req.body);
      if (error) {
        const mensajes = error.details.map(d => d.message).join(', ');
        return handleErrorClient(res, 400, `Validación fallida: ${mensajes}`);
      }

      const pauta = await createPautaEvaluacion(value);
        handleSuccess(res, 201, "Pauta de evaluación creada exitosamente", pauta);
    } catch (error) {
        if (error.message.includes("Ya existe")) {
          return handleErrorClient(res, 409, error.message);
        }
        handleErrorServer(res, 500, "Error al crear la pauta de evaluación", error.message);
    }
  }

    // Obtener todas las pautas de evaluación
    async getAll(req, res) {
        try {
            const pautas = await findPautasEvaluacion();
            handleSuccess(res, 200, "Pautas de evaluación obtenidas", pautas);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener las pautas de evaluación", error.message);
        }
    }

    // Obtener una pauta de evaluación por ID
    async getById(req, res) {
        try {
            const { idPauta } = req.params;
            const pauta = await findPautaEvaluacionById(idPauta);
            handleSuccess(res, 200, "Pauta de evaluación obtenida", pauta);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener la pauta de evaluación", error.message);
        }
    }

    // Actualizar una pauta de evaluación existente
    async update(req, res) {
        try {
            const { idPauta } = req.params;
            // Validar datos con Joi
            const { error, value } = validateUpdatePauta(req.body);
            if (error) {
              const mensajes = error.details.map(d => d.message).join(', ');
              return handleErrorClient(res, 400, `Validación fallida: ${mensajes}`);
            }

            const pauta = await updatePautaEvaluacion(idPauta, value);
            handleSuccess(res, 200, "Pauta de evaluación actualizada", pauta);
        } catch (error) {
            if (error.message.includes("no encontrada")) {
              return handleErrorClient(res, 404, error.message);
            }
            handleErrorServer(res, 500, "Error al actualizar la pauta de evaluación", error.message);
        }
    }

    // Eliminar una pauta de evaluación existente
    async delete(req, res) {
        try {
            const { idPauta } = req.params;
            const pauta = await deletePautaEvaluacion(idPauta);
            handleSuccess(res, 200, "Pauta de evaluación eliminada", pauta);
        } catch (error) {
            handleErrorServer(res, 500, "Error al eliminar la pauta de evaluación", error.message);
        }
    }
}