// src/index.js

import express from "express";
import cors from "cors";
import { PORT } from "./config/env.config.js";     // Importa config
import { connectDB } from "./config/db.config.js";     // Importa config
import { routerApi } from "./routes/index.routes.js"; // Importa el enrutador

async function main() {
    try {
        await connectDB();

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