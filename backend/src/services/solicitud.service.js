// src/services/solicitud.service.js
import { AppDataSource } from "../config/db.config.js"; 
import { Solicitud } from "../entities/solicitud.entity.js";

const solicitudRepo = AppDataSource.getRepository(Solicitud);

export const createSolicitud = async (data) => {
  const { idEstudiante, documentos, mensaje } = data; 

  const nuevaSolicitud = solicitudRepo.create({
    idEstudiante: idEstudiante, // relacion usando el id
    estudiante: { id: idEstudiante }, 
    documentos,
    mensaje,
  });

  await solicitudRepo.save(nuevaSolicitud);
  return nuevaSolicitud;
};

export const findSolicitudes = async () => {
  const solicitudes = await solicitudRepo.find({
    relations: ['estudiante'], 
    order: { fechaEnvio: "DESC" }//ordenar por fecha
  });
  return solicitudes;
};

export const updateSolicitudEstado = async (idSolicitud, nuevoEstado, comentarios) => {
  const solicitud = await solicitudRepo.findOneBy({ id: parseInt(idSolicitud) });
  if (!solicitud) {
    throw new Error("Solicitud no encontrada");
  }

  const estadosValidos = ["rechazada", "aprobada"]; 
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error("Estado no válido");
  }

  solicitud.estado = nuevoEstado;
  solicitud.comentariosEncargado = comentarios;
  solicitud.fechaRevision = new Date(); 

  await solicitudRepo.save(solicitud);
  return solicitud;
};

export const deleteSolicitud = async (idSolicitud) => {
  const solicitud = await solicitudRepo.findOneBy({ id: parseInt(idSolicitud) });
  if (!solicitud) {
    throw new Error("Solicitud no encontrada");
  }

  await solicitudRepo.remove(solicitud);
};

//=========Funciones gestion de solicitudes del estudiante=========
export async function getSolicitudesEstudiante(idEstudiante) {
  return await solicitudRepo.find({
    where: { idEstudiante: idEstudiante },
    relations: ["estudiante"],
    order: { fechaEnvio: "DESC" } //recientes primero
  });
}

export async function updateSolicitudEstudiante(idSolicitud, idEstudiante, data) {
  const solicitud = await solicitudRepo.findOne({ where: { id: parseInt(idSolicitud) } });

  if (!solicitud) {
    throw new Error("Solicitud no encontrada");
  }

  if (solicitud.idEstudiante !== idEstudiante) {
    throw new Error("No autorizado");
  }

  if (solicitud.estado === "aprobada") {
    throw new Error("Ya aprobada"); 
  }

  if (data.mensaje) solicitud.mensaje = data.mensaje;
  if (data.documentos) solicitud.documentos = data.documentos;
  
  solicitud.estado = "espera"; 
  solicitud.comentariosEncargado = null; // Descomenta

  solicitud.fechaEnvio = new Date(); 

  return await solicitudRepo.save(solicitud);
}

// Booleano: ¿Tiene el estudiante una solicitud aprobada?
export async function hasApprovedSolicitud(idEstudiante) {
  const solicitud = await solicitudRepo.findOne({
    where: { idEstudiante, estado: "aprobada" },
  });
  return !!solicitud;
}