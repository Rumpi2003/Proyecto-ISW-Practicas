import express from "express";
import cors from "cors";
import { connectDB } from "./config/ConfigDb.js";
import { PORT } from "./config/ConfigEnv.js";

// Importar rutas
import authRoutes from "./routes/auth.routes.js";
import bitacorasRoutes from "./routes/bitacoras.routes.js";
import informesRoutes from "./routes/informes.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
await connectDB();

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/bitacoras", bitacorasRoutes);
app.use("/api/informes", informesRoutes);
app.use("/api/profile", profileRoutes);

// Ruta de prueba
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Iniciar el servidor
app.listen(parseInt(PORT), () => {
  console.log(`API http://localhost:${PORT}`);
});