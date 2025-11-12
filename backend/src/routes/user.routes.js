// src/routes/user.routes.js
import { Router } from "express";
import { adminCreateUser, adminDeleteUser, adminGetAllUsers } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";

const router = Router();
// esta url es solo para admin y encargado, para que creen usuarios
router.get(
  "/",
  authMiddleware,
  checkRole(['admin', 'encargado']),
  adminGetAllUsers
);

router.post(
  "/",
  authMiddleware, 
  checkRole(['admin', 'encargado']), //Solo admin o encargado pueden crear usuarios
  adminCreateUser
);

router.delete(
  "/:id",
  authMiddleware,
  checkRole(['admin', 'encargado']),
  adminDeleteUser
);
// ms rutas de gestión de usuarios


export default router;