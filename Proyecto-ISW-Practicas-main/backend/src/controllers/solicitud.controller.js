import { 
    createSolicitud, 
    findSolicitudes, 
    findSolicitudById,
    updateSolicitudEstado, 
    deleteSolicitud 
} from "../services/solicitud.service.js";

import { 
    handleSuccess, 
    handleErrorClient, 
    handleErrorServer 
} from "../handlers/responseHandlers.js";

export class SolicitudController {

    // Crear solicitud
    async create(req, res) {
        try {
            const { mensaje, documentos } = req.body;
            const idEstudianteVerificado = req.user.id;

            if (!mensaje) return handleErrorClient(res, 400, "El mensaje es requerido");

            const data = {
                idEstudiante: idEstudianteVerificado,
                mensaje,
                documentos: documentos || []
            };

            const nuevaSolicitud = await createSolicitud(data);
            handleSuccess(res, 201, "Solicitud creada exitosamente", nuevaSolicitud);
        } catch (error) {
            handleErrorServer(res, 500, "Error interno al crear", error.message);
        }
    }

    // Obtener todas
    async getAll(req, res) {
        try {
            const solicitudes = await findSolicitudes();
            handleSuccess(res, 200, "Listado obtenido", solicitudes);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener listado", error.message);
        }
    }

    //  Obtener una solicitud
    async getById(req, res) {
        try {
            const { id } = req.params;
            
            const solicitud = await findSolicitudById(id);
            
            if (!solicitud) {
                return handleErrorClient(res, 404, "Solicitud no encontrada");
            }

            handleSuccess(res, 200, "Detalle de solicitud obtenido", solicitud);
        } catch (error) {
            handleErrorServer(res, 500, "Error al obtener la solicitud", error.message);
        }
    }

    // Actualizar estado
    async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const datosActualizacion = req.body;

            if (!id || isNaN(id)) return handleErrorClient(res, 400, "ID no válido");

            const solicitudActualizada = await updateSolicitudEstado(id, datosActualizacion);
            handleSuccess(res, 200, "Solicitud actualizada", solicitudActualizada);
        } catch (error) {
            if (error.message === "Solicitud no encontrada") return handleErrorClient(res, 404, error.message);
            handleErrorServer(res, 500, "Error al actualizar", error.message);
        }
    }

    // Eliminar
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id || isNaN(id)) return handleErrorClient(res, 400, "ID no válido");

            await deleteSolicitud(id);
            handleSuccess(res, 200, "Solicitud eliminada");
        } catch (error) {
            handleErrorServer(res, 500, "Error al eliminar", error.message);
        }
    }
}

export const solicitudController = new SolicitudController();