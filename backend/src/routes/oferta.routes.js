import { Router } from "express";
import { OfertaController } from "../controllers/oferta.controller.js"; 
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";

const router = Router();
const ofertaController = new OfertaController(); 

// Ruta para Crear Oferta
router.post("/", authMiddleware, checkEncargado, (req, res) => ofertaController.publish(req, res));

// Ruta para Obtener Ofertas (Esta es la que faltaba)
router.get("/", authMiddleware, checkEncargado, (req, res) => ofertaController.getOffers(req, res));

export default router;