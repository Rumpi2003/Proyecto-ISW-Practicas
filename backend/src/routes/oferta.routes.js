import { Router } from "express";
import { OfertaController } from "../controllers/oferta.controller.js"; // Importa la clase
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";

const router = Router();
const ofertaController = new OfertaController(); // Crea la instancia

// Ahora usas el método de la clase
router.post("/", authMiddleware, checkEncargado, (req, res) => ofertaController.create(req, res));

export default router;