import { AppDataSource } from "../config/db.config.js";
import { Solicitud } from "../entities/solicitud.entity.js";
import { handleErrorClient } from "../handlers/responseHandlers.js";

// Verifica que el estudiante tenga al menos una solicitud aprobada
export const checkPracticaAprobada = async (req, res, next) => {
  try {
    if (!req.user) {
      return handleErrorClient(res, 401, "Error de autenticación: usuario no presente en la petición.");
    }

    const solicitudRepo = AppDataSource.getRepository(Solicitud);
    const aprobada = await solicitudRepo.findOne({
      where: { idEstudiante: req.user.id, estado: "aprobada" },
    });

    if (!aprobada) {
      return handleErrorClient(
        res,
        403,
        "Necesitas una solicitud de práctica aprobada para realizar esta acción."
      );
    }

    // Marcamos en la request que tiene práctica aprobada (por si se necesita más adelante)
    req.practicaAprobada = true;
    next();
  } catch (error) {
    return handleErrorClient(res, 500, "Error al verificar práctica aprobada", error.message);
  }
};
