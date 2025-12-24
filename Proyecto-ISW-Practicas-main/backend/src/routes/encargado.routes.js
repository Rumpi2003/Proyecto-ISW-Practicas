// src/routes/encargado.routes.js
import { Router } from "express";
import { EncargadoController } from "../controllers/encargado.controller.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";

const router = Router();
const controller = new EncargadoController();


// router.use(authMiddleware); // Descomenta esto si usas login
router.use(checkEncargado);

// GET: Ver pendientes
router.get("/pendientes", controller.getPendientes);

// GET: Ver detalle de una práctica
router.get("/:id", controller.getDetalle);

// POST: Evaluar práctica
router.post("/:id/evaluar", controller.evaluar);

export default router;