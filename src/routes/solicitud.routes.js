// src/routes/solicitud.routes.js
import { Router } from "express";
import { SolicitudController } from "../controllers/solicitud.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
const controller = new SolicitudController(); // Instancia del controlador

// POST /api/solicitudes -> Crear una solicitud
router.post("/", authMiddleware, controller.create);

// GET /api/solicitudes -> Ver todas las solicitudes
router.get("/", authMiddleware, controller.getAll);

// PUT /api/solicitudes/:id -> Actualizar estado (aprobada/rechazada)
router.put("/:idSolicitud", authMiddleware, controller.updateEstado);

export default router;