import {
    obtenerPendientes,
    obtenerDetallesPractica,
    calificarPractica,
    getHistorialEvaluaciones,
} from "../services/evaluacionEncargado.service.js";

import {
    handleSuccess,
    handleErrorClient,
    handleErrorServer,
} from "../handlers/responseHandlers.js";

/**
 * Controlador para la gestión de evaluaciones por parte del Encargado.
 */
export class EncargadoController {
    /**
     * GET /api/encargado/pendientes
     */
    async getPendientes(req, res) {
        try {
            const data = await obtenerPendientes();
            handleSuccess(
                res,
                200,
                "Lista de pendientes obtenida correctamente",
                data
            );
        } catch (error) {
            handleErrorServer(
                res,
                500,
                "Error al listar los estudiantes pendientes",
                error.message
            );
        }
    }

    /**
     * GET /api/encargado/detalle/:id
     * Devuelve:
     * - estudiante
     * - informeFinal (url o null)
     * - bitacoras (array de urls)
     * - notaSupervisor
     * - fechaLimiteEvaluacion (si existe)
     * - estado
     */
    async getDetalle(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return handleErrorClient(
                    res,
                    400,
                    "El ID de la práctica proporcionado no es válido"
                );
            }

            const detalle = await obtenerDetallesPractica(Number(id));
            if (!detalle) {
                return handleErrorClient(
                    res,
                    404,
                    "La práctica solicitada no fue encontrada"
                );
            }

            // DTO consistente con el service
            const respuesta = {
                estudiante: detalle.estudiante,
                informeFinal: detalle.informeFinal, // url o null
                bitacoras: detalle.bitacoras, // array
                notaSupervisor: detalle.notaSupervisor,
                fechaLimiteEvaluacion: detalle.fechaLimiteEvaluacion, // puede venir null
                estado: detalle.estado,
                fechaEnvio: detalle.fechaEnvio,
            };

            handleSuccess(
                res,
                200,
                "Detalles de la práctica obtenidos correctamente",
                respuesta
            );
        } catch (error) {
            handleErrorServer(
                res,
                500,
                "Error interno al obtener los detalles",
                error.message
            );
        }
    }

    /**
     * POST /api/encargado/evaluar/:id
     * - body: { nota | notaEncargado, comentarios? }
     * - file: req.file (PDF pauta)
     */
    async evaluar(req, res) {
        try {
            const { id } = req.params;

            // Compatibilidad: nota o notaEncargado
            const { nota, notaEncargado, comentarios } = req.body;
            const notaFinal = Number(nota ?? notaEncargado);

            if (!id || isNaN(Number(id))) {
                return handleErrorClient(
                    res,
                    400,
                    "El ID de la práctica proporcionado no es válido"
                );
            }

            // Rango 1.0 - 7.0
            if (!notaFinal || isNaN(notaFinal) || notaFinal < 1 || notaFinal > 7) {
                return handleErrorClient(
                    res,
                    400,
                    "La nota debe ser un valor numérico válido entre 1.0 y 7.0"
                );
            }

            // Si se subió pauta PDF, guardamos url relativa para servirla luego
            const urlPauta = req.file
                ? `/uploadsEncargado/${req.file.filename}`
                : null;

            const resultado = await calificarPractica(
                Number(id),
                notaFinal,
                urlPauta,
                comentarios
            );

            handleSuccess(res, 200, "Evaluación registrada exitosamente", resultado);
        } catch (error) {
            const errorMsg = error.message;

            // Errores de negocio controlados:
            if (
                errorMsg === "No encontrado" ||
                errorMsg === "Solicitud no encontrada"
            ) {
                return handleErrorClient(
                    res,
                    404,
                    "Práctica no encontrada en el sistema"
                );
            }
            if (
                errorMsg === "Falta nota supervisor" ||
                errorMsg === "El supervisor aún no ha ingresado su calificación."
            ) {
                return handleErrorClient(
                    res,
                    400,
                    "Acción denegada: El supervisor de la empresa aún no ha ingresado su calificación."
                );
            }
            if (errorMsg === "Plazo vencido") {
                return handleErrorClient(
                    res,
                    400,
                    "El plazo reglamentario para evaluar esta práctica ha expirado."
                );
            }

            handleErrorServer(
                res,
                500,
                "Error interno al procesar la calificación",
                errorMsg
            );
        }
    }
    async verHistorial(req, res) {
        try {
            const historial = await getHistorialEvaluaciones();
            handleSuccess(res, 200, "Historial de evaluaciones obtenido correctamente", historial);
        } catch (error) {
            handleErrorServer(res, 500, "Error al recuperar el historial", error.message);
        }
    }
}