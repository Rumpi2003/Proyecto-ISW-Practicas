"use strict";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Resolver ruta absoluta a .env (raíz del proyecto)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

// Cargar .env (si no existe, usar resolución por defecto)
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// No exponer valores, solo referencias
export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const DB_PORT = process.env.DB_PORT;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DATABASE = process.env.DATABASE;
export const JWT_SECRET = process.env.JWT_SECRET;
export const COOKIE_KEY = process.env.COOKIE_KEY;

// Validación silenciosa (sin mostrar secretos)
const required = ["HOST","PORT","DB_PORT","DB_USERNAME","DB_PASSWORD","DATABASE","JWT_SECRET","COOKIE_KEY"];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.warn("⚠ Variables de entorno faltantes:", missing.join(", "));
}
