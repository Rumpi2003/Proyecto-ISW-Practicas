import { handleErrorClient } from "../handlers/responseHandlers.js";

export const checkEncargado = (req, res, next) => {
  if (!req.user) {
    return handleErrorClient(res, 401, "Error de autenticación: No se encontraron datos del usuario.");
  }

  console.log("👮 [CheckEncargado] Usuario detectado:", req.user);

  if (req.user.rol !== 'encargado') {
    return handleErrorClient(
      res, 
      403, 
      `Acceso denegado. Se requiere rol 'encargado', pero tu rol es '${req.user.rol || "indefinido"}'.`
    );
  }

  next();
};