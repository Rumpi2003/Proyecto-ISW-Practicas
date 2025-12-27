import { obtenerDetallesPractica, calificarPractica, getHistorialEvaluaciones } from "../services/evaluacion.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export class EvaluacionController {

    // GET: Ver documentos y estado actual
    async getDetalles(req, res) {
        try {
            const { id } = req.params;
            if (!id || isNaN(id)) return handleErrorClient(res, 400, "ID de práctica inválido");
            const solicitud = await obtenerDetallesPractica(id);
            if (!solicitud) return handleErrorClient(res, 404, "Práctica no encontrada");

            const respuesta = {
                estudiante: solicitud.estudiante,
                informeFinal: solicitud.urlInformeFinal,
                bitacoras: solicitud.urlsBitacoras,
                notaSupervisor: solicitud.notaSupervisor,
                fechaLimite: solicitud.fechaLimiteEvaluacion,
                estado: solicitud.estado
            };
            handleSuccess(res, 200, "Detalles obtenidos correctamente", respuesta);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener detalles", error.message);
        }
    }

    // POST: Calificar
    async calificar(req, res) {
        try {
            const { id } = req.params;
            const { notaEncargado } = req.body;

            if (!notaEncargado || isNaN(notaEncargado) || notaEncargado < 1 || notaEncargado > 7) {
                return handleErrorClient(res, 400, "La nota debe ser un número válido (1.0 - 7.0)");
            }

            const resultado = await calificarPractica(id, notaEncargado);
            handleSuccess(res, 200, "Evaluación registrada exitosamente", resultado);

        } catch (error) {
            if (error.message === "Solicitud no encontrada") return handleErrorClient(res, 404, error.message);
            if (error.message === "Falta la nota del supervisor") return handleErrorClient(res, 400, error.message);
            if (error.message === "Plazo vencido") return handleErrorClient(res, 400, "El plazo de evaluación ha expirado.");
            handleErrorServer(res, 500, "Error interno al calificar", error.message);
        }
    }

    async verHistorial(req, res) {
        try {
            const historial = await getHistorialEvaluaciones();
            handleSuccess(res, 200, "Historial obtenido correctamente", historial);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener historial", error.message);
        }
    }

} 