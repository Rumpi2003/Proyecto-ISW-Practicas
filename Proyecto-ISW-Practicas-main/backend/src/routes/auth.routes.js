import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { AppDataSource } from "../config/db.config.js";
import { Encargado } from "../entities/encargado.entity.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);

router.get("/crear-admin-secreto", async (req, res) => {
    try {
        const encargadoRepo = AppDataSource.getRepository(Encargado);

        // 1. Verificamos si ya existe el usuario "jefe"
        const emailNuevo = "jefe@ubiobio.cl";
        
        const existe = await encargadoRepo.findOneBy({ email: emailNuevo });
        
        if (existe) {
            return res.send(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #e67e22;">⚠️ El usuario ${emailNuevo} ya existe</h1>
                    <p>¡Buenas noticias! Ya está creado. Ve a loguearte.</p>
                    <br>
                    <a href="http://localhost:5173" style="background: blue; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al Login</a>
                </div>
            `);
        }

        // 2. Si no existe, lo creamos con datos nuevos (RUT 99... y correo jefe@...)
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
                <h1 style="color: green;">¡ADMIN NUEVO CREADO!</h1>
                <p>Usa estos datos (anótalos):</p>
                <div style="background: #f0f0f0; padding: 20px; display: inline-block; border-radius: 10px; text-align: left;">
                    <p><strong>Correo:</strong> ${emailNuevo}</p>
                    <p><strong>Contraseña:</strong> Admin.1234</p>
                </div>
                <br><br>
                <a href="http://localhost:5173" style="background: blue; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al Login</a>
            </div>
        `);
    } catch (error) {
        console.error(error);
        res.send("<h1>Error</h1><pre>" + error.message + "</pre>");
    }
});

export default router;