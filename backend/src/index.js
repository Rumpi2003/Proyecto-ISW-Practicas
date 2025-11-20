import "dotenv/config";
import express from "express";
import cors from "cors";
import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";

import ofertasRoutes from "./routes/ofertas.routes.js"; 
import carrerasRoutes from "./routes/carreras.routes.js"; 
import empresasRoutes from "./routes/empresas.routes.js";

async function main() {
  try {
    await connectDB();

    const app = express();

    app.use(cors());
    app.use(express.json());
    
        // Rutas de Ofertas
    app.use("/api/v1/ofertas", ofertasRoutes);

        // Rutas de Carreras
    app.use("/api/v1/carreras", carrerasRoutes); 

    app.use("/api/v1/empresas", empresasRoutes);

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1); 
  }
}
main();