import { Router } from "express";
import { crearOferta,obtenerOferta,actualizarOferta,eliminarOferta } from "../controllers/ofertas.controller.js"; 

const router = Router();

router.post("/", crearOferta);
router.get("/:id", obtenerOferta);        
router.put("/:id", actualizarOferta);     
router.delete("/:id", eliminarOferta);

export default router;