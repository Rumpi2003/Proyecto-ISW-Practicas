import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import {
    findEvaluacionesPendientes,
    evaluarAlumno,
    findEvaluacionById,
} from "../services/evaluacion.service.js";

// GET /api/evaluacion  -> lista de pendientes
export async function getAllEvaluaciones(_req, res) {
    try {
        const evaluaciones = await findEvaluacionesPendientes();
        handleSuccess(res, 200, "Evaluaciones pendientes obtenidas", evaluaciones);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener evaluaciones", error.message);
    }
}

// GET /api/evaluacion/:id  -> traer una evaluación
export async function getEvaluacionById(req, res) {
    try {
        const { id } = req.params;
        const evaluacion = await findEvaluacionById(id);
        if (!evaluacion) return handleErrorClient(res, 404, "Evaluación no encontrada");
        handleSuccess(res, 200, "Evaluación encontrada", evaluacion);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener evaluación", error.message);
    }
}

// PUT /api/evaluacion/:id  -> actualizar nota del Encargado
export async function updateEvaluacion(req, res) {
    try {
        const { id } = req.params;
        const { nota_encargado } = req.body;

        const nota = parseFloat(nota_encargado);
        if (!id || Number.isNaN(nota)) return handleErrorClient(res, 400, "ID o nota inválida");
        if (nota < 1.0 || nota > 7.0) return handleErrorClient(res, 400, "La nota debe estar entre 1.0 y 7.0");

        const evaluacionActualizada = await evaluarAlumno(id, nota);
        handleSuccess(res, 200, "Evaluación actualizada y promediada con éxito", evaluacionActualizada);
    } catch (error) {
        handleErrorClient(res, 404, error.message);
    }
}

