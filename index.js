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

app.post('/api/evaluar/:id_alumno', (req, res) => {
    try {
        //Con esto obtenemos el ID del URL y la nota del body
        const { id_alumno } = req.params;
        const { nota_encargado } = req.body;

        //Validación de una nota
        const notaEncargado = parseFloat(nota_encargado);
        if (isNaN(notaEncargado) || notaEncargado < 1.0 || notaEncargado > 7.0) {
            return res.status(400).json({ message: "La nota debe ser un número mayor o igual a 1.0 y menos o igual a 7.0" });
        }

        //Leer la BD
        const dbRaw = fs.readFileSync('db.json');
        let db = JSON.parse(dbRaw);

        //Encontrar la evaluación
        let evaluacion = db.evaluaciones.find(e => e.alumno_id == parseInt(id_alumno));
        if (!evaluacion) {
            return res.status(404).json({ message: "Evaluación no encontrada" });
        }

        // Promedio
        const notaSupervisor = parseFloat(evaluacion.nota_supervisor);
        if (isNaN(notaSupervisor)) {
            return res.status(400).json({ message: "Falta la nota del supervisor para promediar" });
        }
        const nota_final = (notaSupervisor + notaEncargado) / 2;

       //Actualizar los datos
        evaluacion.nota_encargado = notaEncargado;
        evaluacion.nota_final = nota_final;
        evaluacion.estado = 'completado';

        //Guardar de vuelta en el archivo db.json
        fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

        res.status(200).json({ message: "Evaluación guardada con éxito", data: evaluacion});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor"});
    }
});

//Inciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${5000}`);
});