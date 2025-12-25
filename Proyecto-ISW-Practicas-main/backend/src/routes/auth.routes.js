import { Router } from "express";
// Se importa login y register
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

export default router;