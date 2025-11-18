import { Router } from "express";
import { 
    crearEmpresa, 
    listarEmpresas,
    obtenerEmpresa,
    actualizarEmpresa,
    eliminarEmpresa
} from "../controllers/empresa.controller.js";

const router = Router();


router.post("/", crearEmpresa);  
router.get("/", listarEmpresas); 
router.get("/:id", obtenerEmpresa);    
router.patch("/:id", actualizarEmpresa); 
router.delete("/:id", eliminarEmpresa); 

export default router;