import { Router } from "express";
import { getCarreras } from "../controllers/carrera.controller.js";

const router = Router();

router.get("/", getCarreras);

export default router;