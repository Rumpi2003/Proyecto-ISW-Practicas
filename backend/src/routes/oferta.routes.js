import { Router } from "express";
import { OfertaController } from "../controllers/oferta.controller.js"; 
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";

const router = Router();
const ofertaController = new OfertaController(); 

// 1. Crear nueva oferta (POST /api/ofertas)
router.post("/", 
    authMiddleware, 
    checkEncargado, 
    (req, res) => ofertaController.publish(req, res)
);

// 2. Obtener todas las ofertas (GET /api/ofertas)
router.get("/", 
    authMiddleware, 
    checkEncargado, 
    (req, res) => ofertaController.getOffers(req, res)
);

// 3. Modificar oferta existente (PUT /api/ofertas/:id) 👇
router.put("/:id", 
    authMiddleware, 
    checkEncargado, 
    (req, res) => ofertaController.update(req, res)
);

export default router;