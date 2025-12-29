import { Router } from "express";
import { InformeController } from "../controllers/informe.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";
import { uploadPdfMiddleware } from "../middleware/upload.middleware.js";

const router = Router();
const controller = new InformeController();

// Estudiante: subir informe (un único PDF)
router.post(
  "/",
  authMiddleware,
  uploadPdfMiddleware,
  controller.crearInforme.bind(controller)
);

// Estudiante: obtener sus informes
router.get(
  "/mis-informes",
  authMiddleware,
  controller.obtenerMisInformes.bind(controller)
);

// Estudiante: actualizar/eliminar sus informes
router.put(
  "/mis-informes/:idInforme",
  authMiddleware,
  uploadPdfMiddleware,
  controller.actualizarPropio.bind(controller)
);

router.delete(
  "/mis-informes/:idInforme",
  authMiddleware,
  controller.eliminarPropio.bind(controller)
);

// Encargado: obtener todos los informes
router.get(
  "/",
  authMiddleware,
  checkEncargado,
  controller.obtenerTodosLosInformes.bind(controller)
);

// Encargado: obtener informe específico
router.get(
  "/:idInforme",
  authMiddleware,
  checkEncargado,
  controller.obtenerInformePorId.bind(controller)
);

// Encargado: actualizar estado de informe
router.patch(
  "/:idInforme/estado",
  authMiddleware,
  checkEncargado,
  controller.actualizarEstado.bind(controller)
);

// Encargado: eliminar informe
router.delete(
  "/:idInforme",
  authMiddleware,
  checkEncargado,
  controller.eliminarInforme.bind(controller)
);

export default router;
