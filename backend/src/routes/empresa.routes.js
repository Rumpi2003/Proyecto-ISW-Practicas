import { Router } from "express";
import { getEmpresas } from "../controllers/empresa.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Ruta GET /api/empresas
router.get("/", authMiddleware, getEmpresas);

export default router;