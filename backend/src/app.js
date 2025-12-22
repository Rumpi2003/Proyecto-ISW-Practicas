// src/app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routerApi } from "./routes/index.routes.js"; //enrutador principal

const app = express();

//ver las peticiones en la consola
app.use(morgan("dev"));

//permitir que Frontend (puerto 5173) hable con el Backend (puerto 3000)
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true //cookies de sesión
}));

//JSON que vienen en el body de las peticiones
app.use(express.json());

//cookies que guardan el token
app.use(cookieParser());

// --- Rutas ---
routerApi(app); //todas las rutas (/api/auth, /api/users, etc.)

export default app;