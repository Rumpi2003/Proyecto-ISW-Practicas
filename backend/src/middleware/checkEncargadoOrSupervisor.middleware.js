import { handleErrorClient } from "../handlers/responseHandlers.js";

export const checkEncargadoOrSupervisor = (req, res, next) => {
  if (!req.user) {
    return handleErrorClient(res, 401, "No autenticado.");
  }

  if (req.user.rol !== 'encargado' && req.user.rol !== 'supervisor') {
      return handleErrorClient(res, 403, "Acceso denegado. Rol no autorizado.");
  }

  next();
};
