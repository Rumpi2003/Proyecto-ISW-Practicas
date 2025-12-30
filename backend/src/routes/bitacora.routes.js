import { Router } from "express";
import { BitacoraController } from "../controllers/bitacora.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkEncargado } from "../middleware/checkEncargado.middleware.js";
import { uploadBitacorasMiddleware } from "../middleware/upload.middleware.js";

const router = Router();
const controller = new BitacoraController();

// Estudiante: subir bitácoras (PDFs)
router.post(
  "/",
  authMiddleware,
  uploadBitacorasMiddleware,
  controller.crearBitacora.bind(controller)
);

// Estudiante: obtener sus bitácoras
router.get(
  "/mis-bitacoras",
  authMiddleware,
  controller.obtenerMisBitacoras.bind(controller)
);

// Estudiante: actualizar/eliminar sus bitácoras
router.put(
  "/mis-bitacoras/:idBitacora",
  authMiddleware,
  uploadBitacorasMiddleware,
  controller.actualizarPropia.bind(controller)
);

router.delete(
  "/mis-bitacoras/:idBitacora",
  authMiddleware,
  controller.eliminarPropia.bind(controller)
);

// Encargado: obtener todas las bitácoras
router.get(
  "/",
  authMiddleware,
  checkEncargado,
  controller.obtenerTodasLasBitacoras.bind(controller)
);

// Encargado: obtener bitácora específica
router.get(
  "/:idBitacora",
  authMiddleware,
  checkEncargado,
  controller.obtenerBitacoraPorId.bind(controller)
);

// Encargado: actualizar estado de bitácora
router.patch(
  "/:idBitacora/estado",
  authMiddleware,
  checkEncargado,
  controller.actualizarEstado.bind(controller)
);

// Encargado: eliminar bitácora
router.delete(
  "/:idBitacora",
  authMiddleware,
  checkEncargado,
  controller.eliminarBitacora.bind(controller)
);

export default router;
