// src/routes/solicitud.routes.js
import { Router } from "express";
import { SolicitudController } from "../controllers/solicitud.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js"; 

const router = Router();
const controller = new SolicitudController();

router.post("/",
  authMiddleware, 
  controller.create);

router.get(
  "/", 
  authMiddleware,
  checkEncargado,
  controller.getAll
);

router.put(
  "/:idSolicitud", 
  authMiddleware,
  checkEncargado,
  controller.updateEstado
);

router.delete(
  "/:idSolicitud",
  authMiddleware,
  checkEncargado,
  controller.delete
);

router.get(
  "/mis-solicitudes", 
  authMiddleware, 
  controller.getSolicitudesEstudiante
);

router.put(
  "/mis-solicitudes/:idSolicitud", 
  authMiddleware, 
  controller.updatePropia
);
export default router;