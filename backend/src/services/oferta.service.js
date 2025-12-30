import { AppDataSource } from "../config/db.config.js";
import { Oferta } from "../entities/oferta.entity.js";
import { Carrera } from "../entities/carrera.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { In } from "typeorm";

// Función auxiliar para validar fecha
const validarFechaCierre = (fecha) => {
  if (!fecha) return;
  const fechaCierre = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  fechaCierre.setMinutes(fechaCierre.getMinutes() + fechaCierre.getTimezoneOffset());
  fechaCierre.setHours(0, 0, 0, 0);

  if (fechaCierre < hoy) {
    throw new Error("La fecha de cierre no puede ser anterior al día de hoy.");
  }
};

// crear oferta
export const createOferta = async (ofertaData, idEncargado) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  const carreraRepository = AppDataSource.getRepository(Carrera);
  const encargadoRepository = AppDataSource.getRepository(Encargado);

  validarFechaCierre(ofertaData.fechaCierre);

  const encargado = await encargadoRepository.findOneBy({ id: idEncargado });
  if (!encargado) throw new Error("El encargado no existe.");

  const carrerasSeleccionadas = await carreraRepository.findBy({
    id: In(ofertaData.carreras)
  });

  if (carrerasSeleccionadas.length === 0) {
    throw new Error("Debes seleccionar al menos una carrera válida.");
  }

  const nuevaOferta = ofertaRepository.create({
    titulo: ofertaData.titulo,
    descripcion: ofertaData.descripcion,
    fechaCierre: ofertaData.fechaCierre,
    estado: "activa", 
    encargado: encargado,
    carreras: carrerasSeleccionadas,
    empresa: ofertaData.empresa
  });

  return await ofertaRepository.save(nuevaOferta);
};

// obtener ofertas
export const getOfertas = async (filters = {}) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  
  return await ofertaRepository.find({
    where: filters, 
    relations: ["carreras", "encargado", "encargado.facultad"],
    order: { created_at: "DESC" },
  });
};

// actualizar oferta
export const updateOferta = async (id, ofertaData) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  const carreraRepository = AppDataSource.getRepository(Carrera);

  const oferta = await ofertaRepository.findOne({
    where: { id: parseInt(id) },
    relations: ["carreras"]
  });

  if (!oferta) return null; 

  if (ofertaData.estado) {
    oferta.estado = ofertaData.estado;
  }

  if (ofertaData.fechaCierre) {
    validarFechaCierre(ofertaData.fechaCierre);
    oferta.fechaCierre = ofertaData.fechaCierre;
  }

  if (ofertaData.carreras && Array.isArray(ofertaData.carreras)) {
    const nuevasCarreras = await carreraRepository.findBy({
      id: In(ofertaData.carreras)
    });
    if (nuevasCarreras.length === 0) throw new Error("Debes seleccionar al menos una carrera válida.");
    oferta.carreras = nuevasCarreras;
  }

  if (ofertaData.titulo) oferta.titulo = ofertaData.titulo;
  if (ofertaData.descripcion) oferta.descripcion = ofertaData.descripcion;

  return await ofertaRepository.save(oferta);
};

// eliminar oferta
export const deleteOferta = async (id) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  const oferta = await ofertaRepository.findOneBy({ id: parseInt(id) });
  
  if (!oferta) return null;

  return await ofertaRepository.remove(oferta);
};