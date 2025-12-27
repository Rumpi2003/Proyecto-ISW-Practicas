import { AppDataSource } from "../config/db.config.js";
import { Empresa } from "../entities/empresa.entity.js";
import { handleSuccess, handleErrorServer } from "../handlers/responseHandlers.js";

export const getEmpresas = async (req, res) => {
  try {
    const empresaRepository = AppDataSource.getRepository(Empresa);
    const empresas = await empresaRepository.find();

    handleSuccess(res, 200, "Lista de empresas", empresas);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener empresas", error.message);
  }
};