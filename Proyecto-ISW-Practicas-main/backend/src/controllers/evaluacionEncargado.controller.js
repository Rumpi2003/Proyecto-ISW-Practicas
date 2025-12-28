import { 
    obtenerPendientes, 
    obtenerDetallesPractica, 
    calificarPractica,       
    getHistorialEvaluaciones 
} from "../services/evaluacion.service.js";

import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export class EncargadoController {

    // 1. Ver lista de alumnos pendientes de evaluación
    async getPendientes(req, res) {
        try {
            const data = await obtenerPendientes();
            handleSuccess(res, 200, "Lista de pendientes obtenida", data);
        } catch (error) {
            handleErrorServer(res, 500, "Error al listar pendientes", error.message);
        }
    }

    // 2. Ver detalle completo de una práctica (Estudiante, documentos y notas parciales)
    async getDetalle(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return handleErrorClient(res, 400, "ID de práctica inválido");
            }

            const solicitud = await obtenerDetallesPractica(Number(id));

            if (!solicitud) {
                return handleErrorClient(res, 404, "Práctica no encontrada");
            }

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

    // 3. Evaluar (Calificar la práctica)
    async evaluar(req, res) {
        try {
            const { id } = req.params;
            // Aceptamos 'nota' o 'notaEncargado' para mayor compatibilidad
            const { nota, notaEncargado } = req.body; 
            
            const notaFinal = Number(nota || notaEncargado);

            // Validación de nota
            if (!notaFinal || isNaN(notaFinal) || notaFinal < 1 || notaFinal > 7) {
                return handleErrorClient(res, 400, "La nota debe ser un número válido entre 1.0 y 7.0");
            }

            // Llamada al servicio
            const resultado = await calificarPractica(Number(id), notaFinal);
            
            handleSuccess(res, 200, "Evaluación registrada exitosamente", resultado);

        } catch (error) {
            // Manejo de errores específicos de negocio
            if (error.message === "Solicitud no encontrada" || error.message === "No encontrado") {
                return handleErrorClient(res, 404, "Práctica no encontrada");
            }
            if (error.message === "Falta nota supervisor" || error.message === "Falta la nota del supervisor") {
                return handleErrorClient(res, 400, "No se puede evaluar: El supervisor aún no ha puesto su nota.");
            }
            if (error.message === "Plazo vencido") {
                return handleErrorClient(res, 400, "El plazo de evaluación ha expirado.");
            }

            handleErrorServer(res, 500, "Error interno al calificar", error.message);
        }
    }

    // 4. Ver Historial de evaluaciones pasadas
    async verHistorial(req, res) {
        try {
            const historial = await getHistorialEvaluaciones();
            handleSuccess(res, 200, "Historial obtenido correctamente", historial);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener historial", error.message);
        }
    }
}