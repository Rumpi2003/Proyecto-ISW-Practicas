// src/routes/user.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js"; // Importar el nuevo middleware
import {
  createEstudianteCtrl, getEstudiantesCtrl, deleteEstudianteCtrl,
  createEncargadoCtrl, getEncargadosCtrl, deleteEncargadoCtrl,
  createSupervisorCtrl, getSupervisoresCtrl, deleteSupervisorCtrl
} from "../controllers/user.controller.js";

const router = Router();

//todas las rutas debajo de esto requieren:
//estar logueado
//ser encargado
router.use(authMiddleware, checkEncargado);

// === GESTIÓN DE ESTUDIANTES ===
router.post("/estudiantes", createEstudianteCtrl);
router.get("/estudiantes", getEstudiantesCtrl);
router.delete("/estudiantes/:id", deleteEstudianteCtrl);

// === GESTIÓN DE ENCARGADOS ===
router.post("/encargados", createEncargadoCtrl);
router.get("/encargados", getEncargadosCtrl);
router.delete("/encargados/:id", deleteEncargadoCtrl);

// === GESTIÓN DE SUPERVISORES ===
router.post("/supervisores", createSupervisorCtrl);
router.get("/supervisores", getSupervisoresCtrl);
router.delete("/supervisores/:id", deleteSupervisorCtrl);

export default router;