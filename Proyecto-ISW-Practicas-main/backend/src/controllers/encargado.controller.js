// src/controllers/encargado.controller.js
import { obtenerPendientes, obtenerDetalleEvaluacion, registrarNotaEncargado } from "../services/evaluacion.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export class EncargadoController {

    // 1. Ver lista de pendientes
    async getPendientes(req, res) {
        try {
            const data = await obtenerPendientes();
            handleSuccess(res, 200, "Lista de pendientes obtenida", data);
        } catch (error) {
            handleErrorServer(res, 500, "Error al listar pendientes", error.message);
        }
    }

    // 2. Ver detalle de una práctica específica
    async getDetalle(req, res) {
        try {
            const { id } = req.params;
            const data = await obtenerDetalleEvaluacion(Number(id));

            if (!data) return handleErrorClient(res, 404, "Práctica no encontrada");

            handleSuccess(res, 200, "Detalle obtenido", data);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener detalle", error.message);
        }
    }

    // 3. Evaluar
    async evaluar(req, res) {
        try {
            const { id } = req.params;
            const { nota } = req.body;

            const notaNum = Number(nota);
            // Validamos que sea un número entre 1.0 y 7.0
            if (isNaN(notaNum) || notaNum < 1 || notaNum > 7) {
                return handleErrorClient(res, 400, "Nota inválida (debe ser entre 1.0 - 7.0)");
            }

            const result = await registrarNotaEncargado(Number(id), notaNum);
            handleSuccess(res, 200, "Evaluación exitosa", result);

        } catch (error) {
            // Manejo de errores específicos de negocio
            if (error.message === "No encontrado") return handleErrorClient(res, 404, error.message);
            if (error.message === "Falta nota supervisor") return handleErrorClient(res, 400, "El supervisor no ha calificado aún.");
            if (error.message === "Plazo vencido") return handleErrorClient(res, 400, "Plazo de evaluación cerrado.");

            handleErrorServer(res, 500, "Error al evaluar", error.message);
        }
    }
}