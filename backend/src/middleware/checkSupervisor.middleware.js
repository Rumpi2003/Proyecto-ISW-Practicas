import { handleErrorClient } from "../handlers/responseHandlers.js";

export const checkSupervisor = (req, res, next) => {
  if (!req.user) {
    return handleErrorClient(res, 401, "No autenticado.");
  }

    if (req.user.rol !== 'supervisor') {
    return handleErrorClient(
      res, 
      403, 
      "Acceso denegado. Esta función es exclusiva para Supervisores."
    );
  }

  next();
};
