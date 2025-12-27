// src/routes/index.routes.js
import { Router } from "express";
import solicitudRoutes from "./solicitud.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import userRoutes from "./user.routes.js";
import encargadoRoutes from "./encargado.routes.js";

/**
 * Enrutador principal de la API
 * Define el prefijo /api para todas las rutas del sistema
 */
export function routerApi(app) {
  const router = Router();
  
  // Prefijo global para la API
  app.use("/api", router); 

  // Definición de submódulos
  router.use("/solicitudes", solicitudRoutes);
  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);
  router.use("/users", userRoutes);
  router.use("/encargado", encargadoRoutes);
}