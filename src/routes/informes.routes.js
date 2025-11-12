import { Router } from "express";
import { InformesController } from "../controllers/informe.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const controller = new InformesController();

// Todas las rutas de informes requieren autenticación
router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.getById(req, res));
router.put("/:id", authMiddleware, (req, res) => controller.updateInformes(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.delete(req, res));

export default router;