import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { AppDataSource } from "../config/db.config.js";
import { Encargado } from "../entities/encargado.entity.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);

// Endpoint para inicialización del administrador del sistema
router.get("/crear-admin-secreto", async (req, res) => {
    try {
        const encargadoRepo = AppDataSource.getRepository(Encargado);
        const emailNuevo = "jefe@ubiobio.cl";
        
        const existe = await encargadoRepo.findOneBy({ email: emailNuevo });
        
        if (existe) {
            return res.send(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #2c3e50;">Registro existente</h1>
                    <p>El usuario administrador ya se encuentra registrado en el sistema.</p>
                    <br>
                    <a href="http://localhost:5173" style="background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Regresar al Login</a>
                </div>
            `);
        }

        const hashedPassword = await bcrypt.hash("Admin.1234", 10);
        
        const nuevoEncargado = encargadoRepo.create({
            nombre: "Jefe Encargado",
            rut: "99.999.999-9",        
            email: emailNuevo,         
            password: hashedPassword,
            facultad: "Ingeniería - Sistemas"
        });

        await encargadoRepo.save(nuevoEncargado);

        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #27ae60;">Inicialización Exitosa</h1>
                <p>Las credenciales de acceso administrativo han sido configuradas correctamente:</p>
                <div style="background: #f8f9fa; padding: 20px; display: inline-block; border-radius: 10px; text-align: left; border: 1px solid #dee2e6;">
                    <p><strong>Usuario:</strong> ${emailNuevo}</p>
                    <p><strong>Acceso:</strong> Configurado</p>
                </div>
                <br><br>
                <a href="http://localhost:5173" style="background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al Login</a>
            </div>
        `);
    } catch (error) {
        console.error("Error en inicialización:", error);
        res.status(500).send("Error interno durante la creación del administrador.");
    }
});

export default router;