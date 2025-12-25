import { AppDataSource } from "../config/db.config.js";
import { Oferta } from "../entities/oferta.entity.js";
import { Carrera } from "../entities/carrera.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { Empresa } from "../entities/empresa.entity.js";
import { In } from "typeorm";

export const createOferta = async (ofertaData, idEncargado) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  const carreraRepository = AppDataSource.getRepository(Carrera);
  const encargadoRepository = AppDataSource.getRepository(Encargado);
  const empresaRepository = AppDataSource.getRepository(Empresa);

  // 1. Buscamos al Encargado que publica la oferta
  const encargado = await encargadoRepository.findOneBy({ id: idEncargado });
  
  if (!encargado) {
    throw new Error("El encargado no existe.");
  }

  // 2. Buscamos las Carreras seleccionadas
  const carrerasSeleccionadas = await carreraRepository.findBy({
    id: In(ofertaData.carreras) 
  });

  if (carrerasSeleccionadas.length === 0) {
    throw new Error("Debes seleccionar al menos una carrera válida.");
  }

  // 3. Buscamos la Empresa seleccionada
  const empresa = await empresaRepository.findOneBy({ id: ofertaData.empresaId });

  if (!empresa) {
    throw new Error("La empresa seleccionada no existe.");
  }

  // 4. Creamos la oferta con todas sus relaciones y fecha
  const nuevaOferta = ofertaRepository.create({
    titulo: ofertaData.titulo,
    descripcion: ofertaData.descripcion,
    fechaCierre: ofertaData.fechaCierre,
    encargado: encargado,
    carreras: carrerasSeleccionadas,
    empresa: empresa
  });

  // 5. Guardamos
  const ofertaGuardada = await ofertaRepository.save(nuevaOferta);
  
  return ofertaGuardada;
};