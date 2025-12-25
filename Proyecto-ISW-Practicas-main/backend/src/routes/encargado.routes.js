import { Router } from "express";
import { EncargadoController } from "../controllers/encargado.controller.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js"; 

const router = Router();
const controller = new EncargadoController();

// Activación seguridad
router.use(authMiddleware); // Revisa que el token es real
router.use(checkEncargado); // Revisa si es el encargado
// Rutas
router.get("/pendientes", controller.getPendientes);
router.get("/:id", controller.getDetalle);
router.post("/:id/evaluar", controller.evaluar);

export default router;