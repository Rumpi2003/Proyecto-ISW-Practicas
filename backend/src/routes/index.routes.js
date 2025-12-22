// src/routes/index.routes.js
import { Router } from "express";
import solicitudRoutes from "./solicitud.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import userRoutes from "./user.routes.js";
// enrutador principal

export function routerApi(app) {
  const router = Router();
  app.use("/api", router); 

  router.use("/solicitudes", solicitudRoutes);
  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);
  router.use("/users", userRoutes);

  // router.use("/auth", authRoutes); luego de crear ls estudiantes
}