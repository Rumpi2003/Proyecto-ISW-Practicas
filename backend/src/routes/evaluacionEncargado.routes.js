import { Router } from "express";
import { EncargadoController } from "../controllers/evaluacionEncargado.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";
import { uploadMiddleware } from "../middleware/uploadEvaluacion.middleware.js";

const router = Router();
const controller = new EncargadoController();

/**
 * Todas estas rutas requieren:
 * 1) Token válido
 * 2) Rol encargado
 */
router.use(authMiddleware);
router.use(checkEncargado);

/**
 * GET /api/encargado/pendientes
 */
router.get("/pendientes", controller.getPendientes.bind(controller));

/**
 * GET /api/encargado/detalle/:id
 */
router.get("/detalle/:id", controller.getDetalle.bind(controller));

/**
 * POST /api/encargado/evaluar/:id
 * - Recibe nota + comentarios (body)
 * - Recibe PDF pauta (multipart) campo: "pauta"
 */
router.post(
    "/evaluar/:id",
    uploadMiddleware,
    controller.evaluar.bind(controller)
);

/**
 * GET /api/encargado/historial
 */
router.get("/historial", controller.verHistorial.bind(controller));

export default router;