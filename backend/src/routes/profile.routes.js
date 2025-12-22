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

//rutas privadas (estar logueado)
//obtener mis datos 
router.get("/private", authMiddleware, getPrivateProfile);
//actualizar mi propio perfil (Email/Password)
router.patch("/update", authMiddleware, updateProfile);
//eliminar mi propia cuenta
router.delete("/delete", authMiddleware, deleteProfile);

export default router;