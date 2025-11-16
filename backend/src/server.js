import express from "express";
import cors from "cors";
import encargadoRoutes from "./routes/encargado.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/encargado", encargadoRoutes);

//Para ver si funciona
app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
}); 