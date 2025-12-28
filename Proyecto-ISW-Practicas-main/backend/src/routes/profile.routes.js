// src/routes/profile.routes.js
import { Router } from "express";
import { 
  getPublicProfile, 
  getPrivateProfile, 
  updateProfile, 
  deleteProfile 
} from "../controllers/profile.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

//ruta publica (no requiere estar logueado)
router.get("/public", getPublicProfile);

// Rutas protegidas (Requieren autenticación)
// Obtener datos del usuario autenticado
router.get("/private", authMiddleware, getPrivateProfile);

// Actualizar perfil del usuario actual
router.patch("/update", authMiddleware, updateProfile);

// Eliminar cuenta del usuario actual
router.delete("/delete", authMiddleware, deleteProfile);

export default router;