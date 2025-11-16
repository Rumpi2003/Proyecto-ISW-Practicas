import { Router } from "express";
import {
    getPracticasPendientes,
    getDetallePractica,
    evaluarPractica,
} from "../controllers/encargado.controller.js";

const router = Router();

// GET /encargado/practicas/pendientes
router.get("/practicas/pendientes", getPracticasPendientes);

// GET /encargado/practicas/:idPractica
router.get("/practicas/:idPractica", getDetallePractica);

// POST /encargado/practicas/:idPractica/evaluacion
router.post("/practicas/:idPractica/evaluacion", evaluarPractica);

export default router;
