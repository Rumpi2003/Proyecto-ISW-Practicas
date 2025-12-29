import { handleErrorClient } from "../handlers/responseHandlers.js";

/**
 * Middleware para verificar si el usuario es el encargado.
 * Asume que el AuthMiddleware ya decodificó el token y puso la info en req.user
 */
export const checkEncargado = (req, res, next) => {
  // 1. Verificar si hay usuario autenticado
  if (!req.user) {
    return handleErrorClient(res, 401, "Error de autenticación: No se encontraron datos del usuario.");
  }

  // 🔍 LOG DE DEPURACIÓN (Míralo en tu terminal del backend)
  // Esto te dirá exactamente qué rol tiene el usuario detectado.
  console.log("👮 [CheckEncargado] Usuario detectado:", req.user);

  // 2. Verificar el rol
  // Aceptamos 'encargado' (y por seguridad validamos que exista la propiedad rol)
  if (req.user.rol !== 'encargado') {
    return handleErrorClient(
      res, 
      403, 
      `Acceso denegado. Se requiere rol 'encargado', pero tu rol es '${req.user.rol || "indefinido"}'.`
    );
  }

  next();
};