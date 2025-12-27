import {
    createEvaluacionSupervisor,
    findEvaluacionesSupervisor,
    findEvaluacionSupervisorById,
    updateEvaluacionSupervisor,
    deleteEvaluacionSupervisor,
    findAllEvaluacionSupervisorByIdSupervisor
} from "../services/evaluacionSupervisor.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export class EvaluacionSupervisorController {
    // Crear una nueva evaluación de supervisor
    async create(req, res) {
        try {
            const data = req.body;
            const evaluacion = await createEvaluacionSupervisor(data);
            handleSuccess(res, 201, "Evaluación de supervisor creada exitosamente", evaluacion);
        } catch (error) {
            // Si el servicio lanzó un error intencional de validación, responder como error de cliente
            if (error && typeof error.message === 'string' && error.message.startsWith('CLIENT:')) {
                const msg = error.message.replace('CLIENT:', '');
                return handleErrorClient(res, 400, msg);
            }
            handleErrorServer(res, 500, "Error al crear la evaluación de supervisor", error.message);
        }
    }

    // Obtener todas las evaluaciones de supervisor
    async getAll(req, res) {
        try {
            const evaluaciones = await findEvaluacionesSupervisor();
            handleSuccess(res, 200, "Evaluaciones de supervisor obtenidas", evaluaciones);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener las evaluaciones de supervisor", error.message);
        }
    }

    // Obtener una evaluación de supervisor por ID
    async getById(req, res) {
        try {
            const { idEvaluacion } = req.params;
            const evaluacion = await findEvaluacionSupervisorById(idEvaluacion);
            handleSuccess(res, 200, "Evaluación de supervisor obtenida", evaluacion);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener la evaluación de supervisor", error.message);
        }
    }

    // Obtener todas las evaluaciones de supervisor por ID de supervisor
    async getAllBySupervisorId(req, res) {
        try {
            const { idSupervisor } = req.params;
            const evaluaciones = await findAllEvaluacionSupervisorByIdSupervisor(idSupervisor);
            handleSuccess(res, 200, "Evaluaciones de supervisor obtenidas", evaluaciones);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener las evaluaciones de supervisor", error.message);
        }
    }

    // Actualizar una evaluación de supervisor existente
    async update(req, res) {
        try {
            const { idEvaluacion } = req.params;
            const data = req.body;
            const evaluacion = await updateEvaluacionSupervisor(idEvaluacion, data);
            handleSuccess(res, 200, "Evaluación de supervisor actualizada", evaluacion);
        } catch (error) {
            handleErrorServer(res, 500, "Error al actualizar la evaluación de supervisor", error.message);
        }
    }

    // Eliminar una evaluación de supervisor
    async delete(req, res) {
        try {
            const { idEvaluacion } = req.params;
            const evaluacion = await deleteEvaluacionSupervisor(idEvaluacion);
            handleSuccess(res, 200, "Evaluación de supervisor eliminada", evaluacion);
        } catch (error) {
            handleErrorServer(res, 500, "Error al eliminar la evaluación de supervisor", error.message);
        }
    }
}