// src/routes/solicitud.routes.js
import { Router } from "express";
import { SolicitudController } from "../controllers/solicitud.controller.js";

const router = Router();
const controller = new SolicitudController(); // Instancia del controlador

// POST /api/solicitudes -> Crear una solicitud
router.post("/", controller.create);

// GET /api/solicitudes -> Ver todas las solicitudes
router.get("/", controller.getAll);

// PUT /api/solicitudes/:id -> Actualizar estado (aprobada/rechazada)
router.put("/:idSolicitud", controller.updateEstado);

export default router;