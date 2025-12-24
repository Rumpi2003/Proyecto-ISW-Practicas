import { AppDataSource } from "../config/db.config.js";
import { Oferta } from "../entities/oferta.entity.js";

const ofertaRepo = AppDataSource.getRepository(Oferta);

export async function createOferta(data, idEncargado) {
  const nuevaOferta = ofertaRepo.create({
    ...data,
    encargado: { id: idEncargado } // Vinculamos automáticamente al encargado que está logueado
  });
  return await ofertaRepo.save(nuevaOferta);
}

export async function getOfertas() {
  return await ofertaRepo.find({
    relations: ["supervisor", "encargado"], // Esto trae los datos del supervisor incluyendo su empresa
  });
}