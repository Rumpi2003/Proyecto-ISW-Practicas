import "dotenv/config";
import express from "express";
import cors from "cors";
import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";

import { OfertasService } from "./services/ofertas.service.js"; 
import ofertasRoutes from "./routes/ofertas.routes.js"; 

async function main() {
    try {
        await connectDB();

        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use("/api/v1/ofertas", ofertasRoutes);

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1); 
    }
}
main();