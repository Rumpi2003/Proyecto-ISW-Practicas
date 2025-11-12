"use strict";
import dotenv from "dotenv";

// Carga las variables del archivo .env
dotenv.config({ path: '.env' }); 

// Variables de entorno con valores por defecto y conversión a número (para puertos)
export const HOST = process.env.DB_HOST || "localhost";
export const PORT = parseInt(process.env.PORT) || 3000;
export const DB_PORT = parseInt(process.env.DB_PORT) || 5432;

// Variables de entorno sin valores por defecto (deben estar en .env o serán undefined)
export const DB_USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.DB_PASSWORD;
export const DATABASE = process.env.DATABASE;
export const JWT_SECRET = process.env.JWT_SECRET;
export const cookieKey = process.env.COOKIE_KEY;