import { Router } from "express";
import { solicitudController } from "../controllers/solicitud.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Aplicar seguridad a todas las rutas
router.use(authMiddleware);

// Rutas Generales
router.post("/", solicitudController.create);
router.get("/", solicitudController.getAll);

router.get("/:id", solicitudController.getById);

// Rutas de modificación
router.patch("/:id", solicitudController.updateEstado);
router.delete("/:id", solicitudController.delete);

export default router;