// backend/src/controllers/carrera.controller.js
import { AppDataSource } from "../config/db.config.js";
import { Carrera } from "../entities/carrera.entity.js";

export const getCarreras = async (req, res) => {
  try {
    const { facultadId } = req.query;
    
    // 📢 LOGS DE DEPURACIÓN (Míralos en la terminal de VS Code)
    console.log("========================================");
    console.log("📡 PETICIÓN RECIBIDA EN CARRERAS");
    console.log("📦 Query Params:", req.query);
    console.log("🆔 Facultad ID (raw):", facultadId);

    const carreraRepository = AppDataSource.getRepository(Carrera);
    
    // Opciones base
    const findOptions = {
      relations: ["facultad"],
      where: {} 
    };

    // LÓGICA DE FILTRADO ROBUSTA
    if (facultadId && facultadId !== "undefined" && facultadId !== "null") {
        console.log("✅ Aplicando filtro por ID:", facultadId);
        
        findOptions.where = {
            facultad: {
                id: Number(facultadId) // Convertimos a número
            }
        };
    } else {
        console.log("⚠️ NO se detectó ID válido. Se enviarán TODAS.");
    }

    const carreras = await carreraRepository.find(findOptions);
    console.log(`📤 Enviando ${carreras.length} carreras.`);
    console.log("========================================");

    res.status(200).json({ status: "Success", data: carreras });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error" });
  }
};