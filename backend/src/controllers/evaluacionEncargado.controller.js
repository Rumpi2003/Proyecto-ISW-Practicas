import { 
    obtenerPendientes, 
    obtenerDetallesPractica, 
    calificarPractica,       
    getHistorialEvaluaciones 
} from "../services/evaluacionEncargado.service.js";

import { 
    handleSuccess, 
    handleErrorClient, 
    handleErrorServer 
} from "../handlers/responseHandlers.js";

/**
 * Controlador para la gestión de evaluaciones por parte del Encargado.
 * Maneja la visualización de pendientes, detalles de prácticas y registro de notas.
 */
export class EncargadoController {

    /**
     * Obtiene el listado de estudiantes que tienen evaluaciones pendientes.
     * GET /api/encargado/pendientes
     */
    async getPendientes(req, res) {
        try {
            const data = await obtenerPendientes();
            handleSuccess(res, 200, "Lista de pendientes obtenida correctamente", data);
        } catch (error) {
            handleErrorServer(res, 500, "Error al listar los estudiantes pendientes", error.message);
        }
    }

    /**
     * Recupera el detalle completo de una práctica específica.
     * Incluye datos del estudiante, enlaces a documentos (informe/bitácoras) y estado actual.
     * GET /api/encargado/detalle/:id
     */
    async getDetalle(req, res) {
        try {
            const { id } = req.params;

            // 1. Validación de parámetros
            if (!id || isNaN(Number(id))) {
                return handleErrorClient(res, 400, "El ID de la práctica proporcionado no es válido");
            }

            // 2. Llamada al servicio
            const solicitud = await obtenerDetallesPractica(Number(id));

            if (!solicitud) {
                return handleErrorClient(res, 404, "La práctica solicitada no fue encontrada");
            }

            // 3. Estructuración de la respuesta (DTO)
            const respuesta = {
                estudiante: solicitud.estudiante,
                informeFinal: solicitud.urlInformeFinal,
                bitacoras: solicitud.urlsBitacoras,
                notaSupervisor: solicitud.notaSupervisor,
                fechaLimite: solicitud.fechaLimiteEvaluacion,
                estado: solicitud.estado
            };

            handleSuccess(res, 200, "Detalles de la práctica obtenidos correctamente", respuesta);

        } catch (error) {
            handleErrorServer(res, 500, "Error interno al obtener los detalles", error.message);
        }
    }

    /**
     * Registra la calificación final del encargado para una práctica.
     * Calcula el promedio con la nota del supervisor (manejado en servicio).
     * POST /api/encargado/evaluar/:id
     */
    async evaluar(req, res) {
        try {
            const { id } = req.params;
            // Admite ambos nombres de variable para compatibilidad con el frontend
            const { nota, notaEncargado } = req.body; 
            
            const notaFinal = Number(nota || notaEncargado);

            // 1. Validación de entrada (Rango 1.0 - 7.0)
            if (!notaFinal || isNaN(notaFinal) || notaFinal < 1 || notaFinal > 7) {
                return handleErrorClient(res, 400, "La nota debe ser un valor numérico válido entre 1.0 y 7.0");
            }

            // 2. Ejecución de lógica de negocio
            const resultado = await calificarPractica(Number(id), notaFinal);
            
            handleSuccess(res, 200, "Evaluación registrada exitosamente", resultado);

        } catch (error) {
            // 3. Manejo de Excepciones de Negocio (Reglas específicas)
            const errorMsg = error.message;

            if (errorMsg === "Solicitud no encontrada" || errorMsg === "No encontrado") {
                return handleErrorClient(res, 404, "Práctica no encontrada en el sistema");
            }
            if (errorMsg === "Falta nota supervisor" || errorMsg === "Falta la nota del supervisor") {
                return handleErrorClient(res, 400, "Acción denegada: El supervisor de la empresa aún no ha ingresado su calificación.");
            }
            if (errorMsg === "Plazo vencido") {
                return handleErrorClient(res, 400, "El plazo reglamentario para evaluar esta práctica ha expirado.");
            }

            // Error no controlado
            handleErrorServer(res, 500, "Error interno al procesar la calificación", errorMsg);
        }
    }

    /**
     * Obtiene el historial histórico de todas las evaluaciones realizadas.
     * GET /api/encargado/historial
     */
    async verHistorial(req, res) {
        try {
            const historial = await getHistorialEvaluaciones();
            handleSuccess(res, 200, "Historial de evaluaciones obtenido correctamente", historial);
        } catch (error) {
            handleErrorServer(res, 500, "Error al recuperar el historial", error.message);
        }
    }
}