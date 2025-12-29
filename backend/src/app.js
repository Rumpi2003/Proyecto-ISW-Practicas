// src/app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routerApi } from "./routes/index.routes.js";

import path from "path";
import { fileURLToPath } from "url";

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

routerApi(app);

// Archivos del estudiante (bitácoras e informes)
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Archivos del encargado (pautas firmadas)
app.use(
    "/uploadsEncargadoEv",
    express.static(path.join(__dirname, "../../uploadsEncargadoEv"))
);

export default app;
