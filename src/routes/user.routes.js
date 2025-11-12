// src/routes/user.routes.js
import { Router } from "express";
import { adminCreateUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";

const router = Router();
// esta url es solo para admin y encargado, para que creen usuarios
router.post(
  "/",
  authMiddleware, 
  checkRole(['admin', 'encargado']), //Solo admin o encargado pueden crear usuarios
  adminCreateUser
);

// ms rutas de gestión de usuarios
// router.get("/", authMiddleware, checkRole(['admin']), adminGetAllUsers);

export default router;