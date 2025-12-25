import { AppDataSource } from "../config/db.config.js";
import { Oferta } from "../entities/oferta.entity.js";
import { Carrera } from "../entities/carrera.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { Empresa } from "../entities/empresa.entity.js";
import { In } from "typeorm";

// 1. CREAR OFERTA
export const createOferta = async (ofertaData, idEncargado) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  const carreraRepository = AppDataSource.getRepository(Carrera);
  const encargadoRepository = AppDataSource.getRepository(Encargado);
  const empresaRepository = AppDataSource.getRepository(Empresa);

  // --- VALIDACIÓN DE FECHA ---
  if (ofertaData.fechaCierre) {
    const fechaCierre = new Date(ofertaData.fechaCierre);
    const hoy = new Date();

    // Normalizamos a medianoche para comparar solo días
    hoy.setHours(0, 0, 0, 0);
    
    // Ajuste de zona horaria para evitar que tome el día anterior
    fechaCierre.setMinutes(fechaCierre.getMinutes() + fechaCierre.getTimezoneOffset());
    fechaCierre.setHours(0, 0, 0, 0);

    if (fechaCierre < hoy) {
      throw new Error("La fecha de cierre no puede ser anterior al día de hoy.");
    }
  }

  // --- BUSQUEDA DE RELACIONES ---
  
  // Buscar Encargado
  const encargado = await encargadoRepository.findOneBy({ id: idEncargado });
  if (!encargado) throw new Error("El encargado no existe.");

  // Buscar Empresa
  const empresa = await empresaRepository.findOneBy({ id: ofertaData.empresaId });
  if (!empresa) throw new Error("La empresa seleccionada no existe.");

  // Buscar Carreras
  const carrerasSeleccionadas = await carreraRepository.findBy({
    id: In(ofertaData.carreras) 
  });

  if (carrerasSeleccionadas.length === 0) {
    throw new Error("Debes seleccionar al menos una carrera válida.");
  }

  // --- CREACIÓN ---
  const nuevaOferta = ofertaRepository.create({
    titulo: ofertaData.titulo,
    descripcion: ofertaData.descripcion,
    fechaCierre: ofertaData.fechaCierre,
    encargado: encargado,
    carreras: carrerasSeleccionadas,
    empresa: empresa
  });

  return await ofertaRepository.save(nuevaOferta);
};

// 2. OBTENER OFERTAS (NUEVA FUNCIÓN) 👇
export const getOfertas = async () => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);

  const ofertas = await ofertaRepository.find({
    relations: ["empresa", "carreras", "encargado", "encargado.facultad"],
    order: {
      created_at: "DESC", // Ordenamos: las más nuevas primero
    },
  });

  return ofertas;
};