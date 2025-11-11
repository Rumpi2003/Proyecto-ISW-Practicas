import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = process.nextTick.PORT || 5000;

app.use(cors());
app.use(express.json());

//Ruta de prueba
app.get('/api/evaluaciones', (req, res) => {
    try {
        const dbRaw = fs.readFilesSync('db.json');
        const db = JSON.parse(dbRaw);
        res.status(200).json(db.evaluaciones);
    }
    catch (error) {
        res.status(500).json({ message: "Error al leer la base de datos" });
    }
})