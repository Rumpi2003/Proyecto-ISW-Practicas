import { Router } from "express";
import { crearOferta } from "../controllers/ofertas.controller.js"; 

const router = Router();

router.post("/", crearOferta);

export default router;