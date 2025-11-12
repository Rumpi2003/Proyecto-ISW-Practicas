import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
    res.send("¡Bienvenido!");
});

connectDB()
    .then(() => {
        routerApi(app);

        // ...
        const PORT = Number(process.env.APP_PORT || 3000);
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });

    })
    .catch((error) => {
        console.log("Error al conectar con la base de datos:", error);
        process.exit(1);
    });
