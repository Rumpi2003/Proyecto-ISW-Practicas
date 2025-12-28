// backend/src/routes/evaluacionEncargado.routes.js
import { Router } from "express";
import { EncargadoController } from "../controllers/evaluacionEncargado.controller.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";
import { uploadMiddleware } from "../middleware/uploadEvaluacion.middleware.js";

const router = Router();
const encargadoController = new EncargadoController();

// Bloqueo general: Si no es Encargado, no pasa de aquí
router.use(checkEncargado);

// 1. Ver la lista de los que faltan por nota
router.get("/pendientes", encargadoController.getPendientes);

// 2. Ver la info completa de una práctica (trae los links de los PDFs del alumno)
router.get("/detalle/:id", encargadoController.getDetalle);

// 3. Poner la nota y subir la pauta
router.post(
    "/evaluar/:id", 
    uploadMiddleware, 
    encargadoController.evaluar
);

// 4. Ver historial 
router.get("/historial", encargadoController.verHistorial);

export default router;