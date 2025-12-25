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

  // 1. 🔒 VALIDACIÓN DE NEGOCIO: La fecha no puede ser pasado
  if (ofertaData.fechaCierre) {
    const fechaCierre = new Date(ofertaData.fechaCierre);
    const hoy = new Date();

    // Normalizamos ambas fechas a medianoche (00:00:00) para comparar solo el día
    hoy.setHours(0, 0, 0, 0);
    // Ajustamos la fecha de cierre sumando el offset de zona horaria para asegurar la fecha correcta
    fechaCierre.setMinutes(fechaCierre.getMinutes() + fechaCierre.getTimezoneOffset());
    fechaCierre.setHours(0, 0, 0, 0);

    if (fechaCierre < hoy) {
      throw new Error("La fecha de cierre no puede ser anterior al día de hoy.");
    }
  }

  // 2. Buscamos al Encargado
  const encargado = await encargadoRepository.findOneBy({ id: idEncargado });
  if (!encargado) {
    throw new Error("El encargado no existe.");
  }

  // 3. Buscamos las Carreras seleccionadas
  const carrerasSeleccionadas = await carreraRepository.findBy({
    id: In(ofertaData.carreras) 
  });

  if (carrerasSeleccionadas.length === 0) {
    throw new Error("Debes seleccionar al menos una carrera válida.");
  }

  // 4. Buscamos la Empresa seleccionada
  const empresa = await empresaRepository.findOneBy({ id: ofertaData.empresaId });
  if (!empresa) {
    throw new Error("La empresa seleccionada no existe.");
  }

  // 5. Creamos la oferta con todas sus relaciones
  const nuevaOferta = ofertaRepository.create({
    titulo: ofertaData.titulo,
    descripcion: ofertaData.descripcion,
    fechaCierre: ofertaData.fechaCierre,
    encargado: encargado,
    carreras: carrerasSeleccionadas,
    empresa: empresa
  });

  // 6. Guardamos
  const ofertaGuardada = await ofertaRepository.save(nuevaOferta);
  
  return ofertaGuardada;
};