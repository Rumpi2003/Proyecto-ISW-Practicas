import { AppDataSource } from "../config/db.config.js";
import { Oferta } from "../entities/oferta.entity.js";
import { Carrera } from "../entities/carrera.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { In } from "typeorm"; // Importante para buscar múltiples IDs a la vez

export const createOferta = async (ofertaData, idEncargado) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  const carreraRepository = AppDataSource.getRepository(Carrera);
  const encargadoRepository = AppDataSource.getRepository(Encargado);

  // 1. Buscamos al Encargado que publica la oferta
  const encargado = await encargadoRepository.findOneBy({ id: idEncargado });
  
  if (!encargado) {
    throw new Error("El encargado no existe.");
  }

  // 2. Buscamos las Carreras seleccionadas
  // ofertaData.carreras viene como un array de strings ["1", "5"]
  // Usamos In([...]) para buscar todas esas carreras en una sola consulta
  const carrerasSeleccionadas = await carreraRepository.findBy({
    id: In(ofertaData.carreras) 
  });

  if (carrerasSeleccionadas.length === 0) {
    throw new Error("Debes seleccionar al menos una carrera válida.");
  }

  // 3. Creamos la oferta con sus relaciones
  const nuevaOferta = ofertaRepository.create({
    titulo: ofertaData.titulo,
    descripcion: ofertaData.descripcion,
    encargado: encargado,
    carreras: carrerasSeleccionadas, // Aquí TypeORM crea la magia en la tabla intermedia
    // fechaCierre: ofertaData.fechaCierre (si lo envías desde el front)
  });

  // 4. Guardamos
  const ofertaGuardada = await ofertaRepository.save(nuevaOferta);
  
  return ofertaGuardada;
};