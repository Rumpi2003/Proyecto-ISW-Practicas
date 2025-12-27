import { AppDataSource } from "../config/db.config.js";
import { Solicitud } from "../entities/solicitud.entity.js";
import { Evaluacion } from "../entities/evaluacion.entity.js";

const solicitudRepo = AppDataSource.getRepository(Solicitud);
const evaluacionRepo = AppDataSource.getRepository(Evaluacion);

export const createSolicitud = async (data) => {
  const { idEstudiante, documentos, mensaje } = data;
  
  const nuevaSolicitud = solicitudRepo.create({
    idEstudiante,
    documentos,
    mensaje,
    estado: "espera"
  });

  return await solicitudRepo.save(nuevaSolicitud);
};

export const findSolicitudes = async () => {
  return await solicitudRepo.find({
    relations: ['estudiante', 'evaluacion'],
    order: { fechaEnvio: "DESC" }
  });
};

export const findSolicitudById = async (id) => {
  return await solicitudRepo.findOne({
    where: { id: parseInt(id) },
    relations: ['estudiante', 'evaluacion']
  });
};

export const updateSolicitudEstado = async (idSolicitud, data) => {
  const solicitud = await solicitudRepo.findOneBy({ id: parseInt(idSolicitud) });

  if (!solicitud) {
    throw new Error("Solicitud no encontrada");
  }

  // Actualizar estado de la solicitud
  if (data.estado) {
    const estadosValidos = ["rechazada", "aprobada", "espera"];
    if (!estadosValidos.includes(data.estado)) {
        throw new Error("Estado de solicitud no válido");
    }

    solicitud.estado = data.estado;
    solicitud.fechaRevision = new Date();
    await solicitudRepo.save(solicitud);
  }

  // Gestión de evaluación (Notas y Comentarios)
  if (data.notaEncargado !== undefined || data.notaSupervisor !== undefined || data.comentarios) {
    
    // Buscar evaluación existente o crear una nueva
    let evaluacion = await evaluacionRepo.findOne({
      where: { solicitud: { id: parseInt(idSolicitud) } }
    });

    if (!evaluacion) {
      evaluacion = evaluacionRepo.create({ solicitud: solicitud });
    }

    // Actualizar campos de evaluación
    if (data.comentarios) evaluacion.comentarios = data.comentarios;
    if (data.notaEncargado) evaluacion.notaEncargado = parseFloat(data.notaEncargado);
    if (data.notaSupervisor) evaluacion.notaSupervisor = parseFloat(data.notaSupervisor);
    if (data.urlPauta) evaluacion.urlPauta = data.urlPauta;

    // Cálculo automático del promedio final
    const nEnc = evaluacion.notaEncargado ? parseFloat(evaluacion.notaEncargado) : 0;
    const nSup = evaluacion.notaSupervisor ? parseFloat(evaluacion.notaSupervisor) : 0;

    if (nEnc > 0 && nSup > 0) {
      evaluacion.notaFinal = ((nEnc + nSup) / 2).toFixed(1);
    }

    await evaluacionRepo.save(evaluacion);
  }

  return solicitud;
};

export const deleteSolicitud = async (idSolicitud) => {
  const solicitud = await solicitudRepo.findOneBy({ id: parseInt(idSolicitud) });
  
  if (!solicitud) {
    throw new Error("Solicitud no encontrada");
  }
  
  return await solicitudRepo.remove(solicitud);
};