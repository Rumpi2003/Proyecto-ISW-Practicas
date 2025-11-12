import { Router } from "express";
import {
    getAllEvaluaciones,
    getEvaluacionById,
    updateEvaluacion,
} from "../controllers/evaluacion.controller.js";

const router = Router();

//Pendientes
router.get("/", getAllEvaluaciones);

//Evaluación por ID
router.get("/:id", getEvaluacionById);

//Actualizar nota del Encargado y calcular promedio
//Body: { "nota_encargado": 6.5 }
router.put("/:id", updateEvaluacion);

export default router;
