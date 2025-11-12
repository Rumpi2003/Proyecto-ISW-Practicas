// src/index.js
import dotenv from "dotenv";
import path from "path";
//apunte a la carpeta 'backend/'
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import "dotenv/config";
import express from "express";
import cors from "cors";
import { PORT } from "./config/env.config.js";     // importa config
import { connectDB } from "./config/db.config.js";     // importa config
import { routerApi } from "./routes/index.routes.js"; // importa el enrutador

import { AppDataSource } from "./config/db.config.js"; // para acceder al repositorio
import { User } from "./entities/user.entity.js"; // es un User
import bcrypt from "bcrypt"; // para encriptar la contraseña

async function seedAdmin() {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const adminEmail = "admin@ubb";

    //revisa si hay admin
    const admin = await userRepo.findOneBy({ email: adminEmail });

    if (!admin) {
      //crear si no
      console.log("Admin no encontrado, creando uno nuevo...");
      const hashedPassword = await bcrypt.hash("admin123", 10); // contraseña 'admin123'
      
      const newAdmin = userRepo.create({
        email: adminEmail,
        password: hashedPassword,
        rol: "admin",
      });

      await userRepo.save(newAdmin);
      console.log("Admin 'admin@ubb' creado exitosamente.");
    }
  } catch (error) {
    console.error("Error al sembrar el admin:", error);
  }
}

async function main() {
    try {
        await connectDB();

        await seedAdmin(); // asegura que hay un admin

        const app = express();

        app.use(cors());
        app.use(express.json());

        routerApi(app); //registra rutas
        
        //inicia server
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1); // Salir si la conexión a la DB falla
    }
}
main();