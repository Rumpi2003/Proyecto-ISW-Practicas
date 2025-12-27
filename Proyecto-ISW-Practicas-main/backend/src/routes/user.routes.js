import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";
import {
    getUsers,
    deleteUser,
    createEstudianteCtrl,
    getEstudiantesCtrl,
    deleteEstudianteCtrl,
    createEncargadoCtrl,
    getEncargadosCtrl,
    deleteEncargadoCtrl,
    createSupervisorCtrl,
    getSupervisoresCtrl,
    deleteSupervisorCtrl
} from "../controllers/user.controller.js";

const router = Router();

// Seguridad para todas las rutas de este archivo
router.use(authMiddleware, checkEncargado);

// Ruta principal para la tabla (axios.get('/users'))
router.get("/", getUsers);

// Ruta eliminación
router.delete("/:id", deleteUser);

// Rutas específicas
router.post("/estudiantes", createEstudianteCtrl);
router.get("/estudiantes", getEstudiantesCtrl);
router.delete("/estudiantes/:id", deleteEstudianteCtrl);

router.post("/encargados", createEncargadoCtrl);
router.get("/encargados", getEncargadosCtrl);
router.delete("/encargados/:id", deleteEncargadoCtrl);

router.post("/supervisores", createSupervisorCtrl);
router.get("/supervisores", getSupervisoresCtrl);
router.delete("/supervisores/:id", deleteSupervisorCtrl);

export default router;