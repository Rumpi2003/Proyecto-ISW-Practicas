import { createPautaEvaluacion, findPautasEvaluacion, findPautaEvaluacionById, updatePautaEvaluacion, deletePautaEvaluacion } from "../services/pautaEvaluacion.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export class PautaEvaluacionController {

    // Crear una nueva pauta de evaluación
    async create(req, res) {
        try {
            const { nombre, carrera, nivelPractica, aspectos_a_evaluar } = req.body;
            // Validaciones básicas
            if (!nombre || !carrera || !nivelPractica || !aspectos_a_evaluar) {

                return handleErrorClient(res, 400, "Faltan datos requeridos");
            }
            const data = {
                nombre,
                carrera,
                nivelPractica,
                aspectos_a_evaluar
            };
            const pauta = await createPautaEvaluacion(data);
            handleSuccess(res, 201, "Pauta de evaluación creada exitosamente", pauta);
        } catch (error) {
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
            const data = req.body;
            const pauta = await updatePautaEvaluacion(idPauta, data);
            handleSuccess(res, 200, "Pauta de evaluación actualizada", pauta);
        } catch (error) {
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