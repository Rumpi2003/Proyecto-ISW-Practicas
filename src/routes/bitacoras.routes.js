import { Router } from "express";
import { BitacorasController } from "../controllers/bitacoras.controllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const controller = new BitacorasController();

// Todas las rutas de bitácoras requieren autenticación
router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.getById(req, res));
router.put("/:id", authMiddleware, (req, res) => controller.updateBitacoras(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.delete(req, res));

export default router;