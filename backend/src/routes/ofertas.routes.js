import { Router } from "express";
import { crearOferta,
    obtenerOferta,
    actualizarOferta,
    eliminarOferta,
    listarOfertas } from "../controllers/ofertas.controller.js"; 

const router = Router();

router.post("/", crearOferta);
router.get("/", listarOfertas); 
router.get("/:id", obtenerOferta); 
router.patch("/:id", actualizarOferta);
router.delete("/:id", eliminarOferta);

export default router;