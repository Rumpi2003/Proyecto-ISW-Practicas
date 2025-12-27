import { AppDataSource } from "../config/db.config.js";
import { Oferta } from "../entities/oferta.entity.js";
import { Carrera } from "../entities/carrera.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { Empresa } from "../entities/empresa.entity.js";
import { In } from "typeorm";

// Función auxiliar para validar fecha
const validarFechaCierre = (fecha) => {
  if (!fecha) return;
  const fechaCierre = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  // Ajuste básico de zona horaria para la comparación
  fechaCierre.setMinutes(fechaCierre.getMinutes() + fechaCierre.getTimezoneOffset());
  fechaCierre.setHours(0, 0, 0, 0);

  if (fechaCierre < hoy) {
    throw new Error("La fecha de cierre no puede ser anterior al día de hoy.");
  }
};

// 1. CREAR OFERTA
export const createOferta = async (ofertaData, idEncargado) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  const carreraRepository = AppDataSource.getRepository(Carrera);
  const encargadoRepository = AppDataSource.getRepository(Encargado);
  const empresaRepository = AppDataSource.getRepository(Empresa);

  validarFechaCierre(ofertaData.fechaCierre);

  const encargado = await encargadoRepository.findOneBy({ id: idEncargado });
  if (!encargado) throw new Error("El encargado no existe.");

  const empresa = await empresaRepository.findOneBy({ id: ofertaData.empresaId });
  if (!empresa) throw new Error("La empresa seleccionada no existe.");

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
    estado: "activa", // Por defecto
    encargado: encargado,
    carreras: carrerasSeleccionadas,
    empresa: empresa
  });

  return await ofertaRepository.save(nuevaOferta);
};

// 2. OBTENER OFERTAS (Con soporte para filtros)
export const getOfertas = async (filters = {}) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  
  // Si envían filtros (ej: { estado: 'activa' }), se aplican aquí
  return await ofertaRepository.find({
    where: filters, 
    relations: ["empresa", "carreras", "encargado", "encargado.facultad"],
    order: { created_at: "DESC" },
  });
};

// 3. ACTUALIZAR OFERTA
export const updateOferta = async (id, ofertaData) => {
  const ofertaRepository = AppDataSource.getRepository(Oferta);
  const carreraRepository = AppDataSource.getRepository(Carrera);
  const empresaRepository = AppDataSource.getRepository(Empresa);

  const oferta = await ofertaRepository.findOne({
    where: { id: parseInt(id) },
    relations: ["carreras", "empresa"]
  });

  if (!oferta) return null; // Retornamos null para que el controller maneje el 404

  // Actualizar Estado (Manual)
  if (ofertaData.estado) {
    oferta.estado = ofertaData.estado;
  }

  // Validar y Actualizar Fecha
  if (ofertaData.fechaCierre) {
    validarFechaCierre(ofertaData.fechaCierre);
    oferta.fechaCierre = ofertaData.fechaCierre;
  }

  // Actualizar Empresa
  if (ofertaData.empresaId) {
    const empresa = await empresaRepository.findOneBy({ id: ofertaData.empresaId });
    if (!empresa) throw new Error("La empresa seleccionada no existe.");
    oferta.empresa = empresa;
  }

  // Actualizar Carreras
  if (ofertaData.carreras && Array.isArray(ofertaData.carreras)) {
    const nuevasCarreras = await carreraRepository.findBy({
      id: In(ofertaData.carreras)
    });
    if (nuevasCarreras.length === 0) throw new Error("Debes seleccionar al menos una carrera válida.");
    oferta.carreras = nuevasCarreras;
  }

  // Actualizar Textos
  if (ofertaData.titulo) oferta.titulo = ofertaData.titulo;
  if (ofertaData.descripcion) oferta.descripcion = ofertaData.descripcion;

  return await ofertaRepository.save(oferta);
};