// src/app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routerApi } from "./routes/index.routes.js";

import path from "path";
import { fileURLToPath } from "url";

// Para poder usar __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Evita respuestas 304 en desarrollo (ETag/caché)
app.set("etag", false);

// Evita que el navegador cachee respuestas del API
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

routerApi(app);

// Archivos estáticos (PDFs, etc.)
app.use("/uploads", express.static(path.join(__dirname, "../../../uploads")));
app.use(
  "/uploadsEncargadoEv",
  express.static(path.join(__dirname, "../../../uploadsEncargadoEv"))
);

export default app;
