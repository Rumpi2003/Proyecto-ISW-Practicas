import { Router } from "express";
import pautaEvaluacionRoutes from "./pautaEvaluacion.routes.js";
import evaluacionSupervisorRoutes from "./evaluacionSupervisor.routes.js";
import solicitudRoutes from "./solicitud.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import userRoutes from "./user.routes.js";
import ofertaRoutes from "./oferta.routes.js";
import carreraRoutes from "./carrera.routes.js";
import empresaRoutes from "./empresa.routes.js";

export function routerApi(app) {
  const router = Router();
  
  // Prefijo global "/api"
  app.use("/api", router); 

  // Mantenemos las rutas nuevas que venían de MAIN
  router.use("/pautas-evaluacion", pautaEvaluacionRoutes);
  router.use("/evaluaciones-supervisor", evaluacionSupervisorRoutes);

  router.use("/solicitudes", solicitudRoutes);
  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);
  router.use("/users", userRoutes);
  router.use("/ofertas", ofertaRoutes); // Ruta: /api/ofertas
  router.use("/carreras", carreraRoutes);
  router.use("/empresas", empresaRoutes);
}