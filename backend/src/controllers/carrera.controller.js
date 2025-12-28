import { AppDataSource } from "../config/db.config.js";
import { Carrera } from "../entities/carrera.entity.js";

export const getCarreras = async (req, res) => {
  try {
    const { facultadId } = req.query;
    const carreraRepository = AppDataSource.getRepository(Carrera);
    
    const findOptions = {
      relations: ["facultad"],
      where: {} 
    };

    if (facultadId) {
        findOptions.where = {
            facultad: {
                id: Number(facultadId)
            }
        };
    }

    const carreras = await carreraRepository.find(findOptions);

    res.status(200).json({ status: "Success", data: carreras });
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    res.status(500).json({ status: "Error", message: error.message });
  }
};