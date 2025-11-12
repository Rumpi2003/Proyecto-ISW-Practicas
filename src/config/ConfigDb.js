"use strict";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DATABASE } from "./ConfigEnv.js";
import { Bitacora } from "../entity/bitacora.entity.js";
import { Informe } from "../entity/informe.entity.js";
import { User } from "../entity/usuario.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DATABASE,
  entities: [User, Bitacora, Informe],
  synchronize: true,
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión a PostgreSQL lista");
  } catch (err) {
    console.error("Error DB:", err.message);
    process.exit(1);
  }
}