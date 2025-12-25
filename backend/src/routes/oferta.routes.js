import { Router } from "express";
import { OfertaController } from "../controllers/oferta.controller.js"; 
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";

const router = Router();
const ofertaController = new OfertaController(); 

// ✅ CORREGIDO: Usamos 'publish' para que coincida con tu controlador
router.post("/", authMiddleware, checkEncargado, (req, res) => ofertaController.publish(req, res));

export default router;