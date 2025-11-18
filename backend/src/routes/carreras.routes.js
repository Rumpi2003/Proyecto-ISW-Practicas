import { Router } from "express";
import { 
    crearCarrera, 
    listarCarreras,
    obtenerCarrera,      
    actualizarCarrera,   
    eliminarCarrera      
} from "../controllers/carrera.controller.js";

const router = Router();

router.post("/", crearCarrera);  
router.get("/", listarCarreras); 
router.get("/:id", obtenerCarrera);    
router.patch("/:id", actualizarCarrera); 
router.delete("/:id", eliminarCarrera);


export default router;