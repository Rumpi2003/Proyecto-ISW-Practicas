// src/routes/solicitud.routes.js
import { Router } from "express";
import { SolicitudController } from "../controllers/solicitud.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js"; 
import { uploadMiddleware } from "../middleware/upload.middleware.js";
import { checkPracticaAprobada } from "../middleware/checkPracticaAprobada.middleware.js";

const router = Router();
const controller = new SolicitudController();

router.post("/", 
    authMiddleware, 
    uploadMiddleware,
    controller.create
);

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

// Boolean para UI: ¿tiene alguna solicitud aprobada?
router.get(
  "/mis-solicitudes/aprobada",
  authMiddleware,
  controller.hasAprobada
);

router.put(
  "/mis-solicitudes/:idSolicitud", 
  authMiddleware, 
  uploadMiddleware,
  controller.updatePropia
);

router.patch("/:idSolicitud/estado",
  authMiddleware,
  checkEncargado,
  controller.updateEstado);

// Ejemplo de uso del middleware para proteger futuras rutas (e.g., subir bitácoras)
// router.post("/bitacoras/subir", authMiddleware, checkPracticaAprobada, controllerSubidaBitacoras)

export default router;