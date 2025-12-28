import { AppDataSource } from "../config/db.config.js";
import { InformeFinal } from "../entities/Informe.entity.js"; 
import { Solicitud } from "../entities/solicitud.entity.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export class InformeController {

    async subirInforme(req, res) {
        try {
            const { idSolicitud } = req.params;
            const file = req.file;

            if (!file) return handleErrorClient(res, 400, "Debes subir el archivo PDF del informe.");

            const solicitudRepo = AppDataSource.getRepository(Solicitud);
            const solicitud = await solicitudRepo.findOne({ where: { id: parseInt(idSolicitud) } });

            if (!solicitud) return handleErrorClient(res, 404, "Solicitud no encontrada");

            // Se usa entidad importada desde Informe.entity.js
            const informeRepo = AppDataSource.getRepository(InformeFinal);
            const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

            const nuevoInforme = informeRepo.create({
                urlInforme: url,
                solicitud: { id: solicitud.id }
            });

            await informeRepo.save(nuevoInforme);
            handleSuccess(res, 201, "Informe Final subido exitosamente", nuevoInforme);

        } catch (error) {
            handleErrorServer(res, 500, "Error al subir informe", error.message);
        }
    }
}