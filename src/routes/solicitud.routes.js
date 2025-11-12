// src/routes/solicitud.routes.js
import { Router } from "express";
import { SolicitudController } from "../controllers/solicitud.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";

const router = Router();
const controller = new SolicitudController(); // Instancia del controlador

router.post("/", authMiddleware, controller.create);

router.get("/", authMiddleware, controller.getAll);

router.put(
  "/:idSolicitud", 
  authMiddleware,
  checkRole(['admin', 'encargado']),
  controller.updateEstado
);

router.delete(
  "/:idSolicitud",
  authMiddleware,
  checkRole(['admin', 'encargado']),
  controller.delete
);

export default router;