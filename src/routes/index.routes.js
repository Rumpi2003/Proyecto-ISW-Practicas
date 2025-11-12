// src/routes/index.routes.js
import { Router } from "express";
import solicitudRoutes from "./solicitud.routes.js";
// enrutador principal

export function routerApi(app) {
  const router = Router();
  app.use("/api", router); 

  router.use("/solicitudes", solicitudRoutes);

  // router.use("/auth", authRoutes); luego de crear ls estudiantes
}