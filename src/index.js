// src/index.js

import express from 'express';
import cors from 'cors';
import { PORT } from './config/env.config.js'; 
import { connectDB } from './config/db.config.js';

async function main() {
    try {
        await connectDB();

        const app = express();

        app.use(cors());
        app.use(express.json());

        app.get('/', (req, res) => {
            res.send('API de Prácticas ISW funcionando!');
        });
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1); // Salir si la conexión a la DB falla
    }
}
main();