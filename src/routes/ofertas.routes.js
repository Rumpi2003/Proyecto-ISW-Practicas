import { Router } from "express";
import { crearOferta,
    obtenerOferta,
    actualizarOferta,
    eliminarOferta,
    listarOfertas } from "../controllers/ofertas.controller.js"; 

const router = Router();

router.post("/", crearOferta);
router.get("/:id", obtenerOferta);        
router.put("/:id", actualizarOferta);     
router.delete("/:id", eliminarOferta);
router.get("/", listarOfertas);

export default router;