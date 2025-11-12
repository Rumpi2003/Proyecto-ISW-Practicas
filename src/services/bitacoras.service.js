import { AppDataSource } from "../config/ConfigDb.js";
import { Bitacora } from "../entity/bitacora.entity.js";

const bitacoraRepository = AppDataSource.getRepository(Bitacora);

export const createBitacora = async (bitacoraData) => {
  try {
    const bitacora = bitacoraRepository.create(bitacoraData);
    return await bitacoraRepository.save(bitacora);
  } catch (error) {
    throw new Error(`Error al crear bitácora: ${error.message}`);
  }
};

export const getBitacoras = async (userId) => {
  try {
    return await bitacoraRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  } catch (error) {
    throw new Error(`Error al obtener bitácoras: ${error.message}`);
  }
};

export const getBitacoraById = async (idBitacora) => {
  try {
    return await bitacoraRepository.findOne({
      where: { id: idBitacora },
    });
  } catch (error) {
    throw new Error(`Error al obtener bitácora: ${error.message}`);
  }
};

export const updateBitacora = async (idBitacora, bitacoraData) => {
  try {
    await bitacoraRepository.update({ id: idBitacora }, bitacoraData);
    return await getBitacoraById(idBitacora);
  } catch (error) {
    throw new Error(`Error al actualizar bitácora: ${error.message}`);
  }
};

export const deleteBitacora = async (idBitacora) => {
  try {
    const result = await bitacoraRepository.delete({ id: idBitacora });
    return result.affected > 0;
  } catch (error) {
    throw new Error(`Error al eliminar bitácora: ${error.message}`);
  }
};