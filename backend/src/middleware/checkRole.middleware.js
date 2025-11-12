// src/middleware/checkRole.middleware.js
import { handleErrorClient } from "../handlers/responseHandlers.js";

/**
* * @param {Array<string>} roles - Un array de roles permitidos ['admin', 'encargado']
 */

 export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return handleErrorClient(res, 401, "No autenticado (sin rol)");
    }

    // si no es admin
    if (!roles.includes(req.user.rol)) {
      return handleErrorClient(res, 403, "Acceso prohibido. No tienes el rol requerido.");
    }
    
    next();
  };
};