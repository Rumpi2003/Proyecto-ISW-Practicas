// src/middleware/checkRole.middleware.js
import { handleErrorClient } from "../handlers/responseHandlers.js";

/**
 * Middleware para verificar si el usuario es el encargado.
 * Asume que el AuthMiddleware ya decodificó el token y puso la info en req.user
 */
export const checkEncargado = (req, res, next) => {
  if (!req.user) {
    return handleErrorClient(res, 401, "No autenticado.");
  }

  if (req.user.rol !== 'encargado') {
    return handleErrorClient(
      res, 
      403, 
      "Acceso denegado. Esta función es exclusiva para Encargados."
    );
  }

  next();
};