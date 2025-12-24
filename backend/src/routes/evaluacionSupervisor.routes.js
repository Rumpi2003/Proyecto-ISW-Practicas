import { Router } from "express";
import { EvaluacionSupervisorController } from "../controllers/evaluacionSupervisor.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";
import { checkSupervisor } from "../middleware/checkSupervisor.middleware.js"; 
import { checkEncargadoOrSupervisor } from "../middleware/checkEncargadoOrSupervisor.middleware.js";

const router = Router();
const controller = new EvaluacionSupervisorController();

router.post("/", authMiddleware, checkEncargado, controller.create);

router.get("/", authMiddleware, checkEncargado, controller.getAll);

router.get("/supervisor/:idSupervisor", authMiddleware, checkSupervisor, controller.getAllBySupervisorId);

router.get("/:idEvaluacion", authMiddleware, checkEncargadoOrSupervisor, controller.getById);

router.put("/:idEvaluacion", authMiddleware, checkSupervisor, controller.update);

router.delete("/:idEvaluacion", authMiddleware, checkEncargado, controller.delete);

export default router;