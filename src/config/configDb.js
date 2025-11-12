import "dotenv/config";
import { DataSource } from "typeorm";
import EvaluacionEntity from "../entities/evaluacion.entity.js";

function must(name) {
    const v = process.env[name];
    if (!v) throw new Error(`Falta variable de entorno: ${name}`);
    return v;
}

const HOST = must("DB_HOST");
const PORT = Number(process.env.DB_PORT || 5432);
const USER = must("DB_USER");
const PASS = String(must("DB_PASS"));   // fuerza string
const NAME = must("DB_NAME");

export const AppDataSource = new DataSource({
    type: "postgres",
    host: HOST,
    port: PORT,
    username: USER,
    password: PASS,
    database: NAME,
    entities: [EvaluacionEntity],
    synchronize: true,   // sólo DEV
    logging: false,
});

export async function connectDB() {
    console.log(`Conectando a Postgres -> ${USER}@${HOST}:${PORT}/${NAME}`);
    await AppDataSource.initialize();
    console.log("Conexión exitosa a la base de datos PostgreSQL");
}
