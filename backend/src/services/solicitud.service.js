// src/services/solicitud.service.js
import { AppDataSource } from "../config/db.config.js"; 
import { Solicitud } from "../entities/solicitud.entity.js";

const solicitudRepo = AppDataSource.getRepository(Solicitud);

export const createSolicitud = async (data) => {
  const { idEstudiante, documentos, mensaje } = data; 

  const nuevaSolicitud = solicitudRepo.create({
    estudiante: { id: idEstudiante }, // Asignamos la relación usando el ID
    documentos,
    mensaje,
  });

  await solicitudRepo.save(nuevaSolicitud);
  return nuevaSolicitud;
};

export const findSolicitudes = async () => {
  //datos del alumno (nombre, rut, carrera)
  const solicitudes = await solicitudRepo.find({
    relations: ['estudiante'], 
    order: { fechaRevision: "ASC" } //ordenar por fecha
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