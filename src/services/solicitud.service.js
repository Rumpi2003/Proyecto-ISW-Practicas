// src/services/solicitud.service.js
import { AppDataSource } from "../config/db.config.js"; 
import { Solicitud } from "../entities/solicitud.entity.js";

const solicitudRepo = AppDataSource.getRepository(Solicitud);

export const createSolicitud = async (data) => {
  const { idEstudiante, documentos, mensaje } = data; // todavia no esta estudiante pero asumimos idEstudiante

  const nuevaSolicitud = solicitudRepo.create({
    idEstudiante,
    documentos,
    mensaje,
  });

  await solicitudRepo.save(nuevaSolicitud);
  return nuevaSolicitud;
};
//buscar todas las solicitudes
export const findSolicitudes = async () => {
  const solicitudes = await solicitudRepo.find();
  return solicitudes;
};

//actualizar estado de la solicitud (para el encargado)
//id suponemos que sera la del encargado
export const updateSolicitudEstado = async (idSolicitud, nuevoEstado, comentarios) => {
  const solicitud = await solicitudRepo.findOneBy({ id: parseInt(id) });
  if (!solicitud) {
    throw new Error("Solicitud no encontrada");
  }

  // Validamos que el encargado use un estado correcto 
  const estadosValidos = ["rechazada", "aprobada"]; //en caso rechazada se especifica pq en comentarios
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error("Estado no válido");
  }

  solicitud.estado = nuevoEstado;
  solicitud.comentariosEncargado = comentarios;
  solicitud.fechaRevision = new Date(); 

  await solicitudRepo.save(solicitud);
  return solicitud;
};