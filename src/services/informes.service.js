import { AppDataSource } from "../config/ConfigDb.js";
import { Informe } from "../entity/informe.entity.js";

const informeRepository = AppDataSource.getRepository(Informe);

export const createInforme = async (informeData) => {
  try {
    const informe = informeRepository.create(informeData);
    return await informeRepository.save(informe);
  } catch (error) {
    throw new Error(`Error al crear informe: ${error.message}`);
  }
};

export const getInformes = async (userId) => {
  try {
    return await informeRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  } catch (error) {
    throw new Error(`Error al obtener informes: ${error.message}`);
  }
};

export const getInformeById = async (idInforme) => {
  try {
    return await informeRepository.findOne({
      where: { id: idInforme },
    });
  } catch (error) {
    throw new Error(`Error al obtener informe: ${error.message}`);
  }
};

export const updateInforme = async (idInforme, informeData) => {
  try {
    await informeRepository.update({ id: idInforme }, informeData);
    return await getInformeById(idInforme);
  } catch (error) {
    throw new Error(`Error al actualizar informe: ${error.message}`);
  }
};

export const deleteInforme = async (idInforme) => {
  try {
    const result = await informeRepository.delete({ id: idInforme });
    return result.affected > 0;
  } catch (error) {
    throw new Error(`Error al eliminar informe: ${error.message}`);
  }
};