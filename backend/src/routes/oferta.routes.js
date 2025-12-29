import { Router } from "express";
import { OfertaController } from "../controllers/oferta.controller.js"; 
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";

const router = Router();
const ofertaController = new OfertaController(); 

// 1. Crear nueva oferta (POST) -> Solo Encargado
router.post("/", 
    authMiddleware, 
    checkEncargado, 
    (req, res) => ofertaController.publish(req, res)
);

// 2. Obtener todas las ofertas (GET) -> Accesible para Estudiantes y Encargados
router.get("/", 
    authMiddleware, 
    (req, res) => ofertaController.getOffers(req, res)
);

// 3. Modificar oferta (PUT) -> Solo Encargado
router.put("/:id", 
    authMiddleware, 
    checkEncargado, 
    (req, res) => ofertaController.update(req, res)
);

// 4. Eliminar oferta (DELETE) -> Solo Encargado
router.delete("/:id", 
    authMiddleware, 
    checkEncargado, 
    (req, res) => ofertaController.delete(req, res)
);

export default router;