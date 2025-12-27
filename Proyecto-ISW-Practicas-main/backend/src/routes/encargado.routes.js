import { Router } from "express";
import { EncargadoController } from "../controllers/encargado.controller.js"; 
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js"; 

const router = Router();
const controller = new EncargadoController();

// --- 1. Seguridad Global ---
router.use(authMiddleware); // Protege todas las rutas de abajo
router.use(checkEncargado); // Solo encargados pueden pasar

// --- 2. Rutas Específicas ---
router.get("/historial", (req, res) => controller.verHistorial(req, res));
router.get("/pendientes", controller.getPendientes);

// --- 3. Rutas Dinámicas ---
router.get("/:id", controller.getDetalle);
router.post("/:id/evaluar", controller.evaluar);

export default router;