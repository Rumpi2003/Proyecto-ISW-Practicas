import { AppDataSource } from "../config/db.config.js";
import { Bitacora } from "../entities/bitacora.entity.js";

const bitacoraRepo = AppDataSource.getRepository(Bitacora);

export const crearBitacora = async (data) => {
  const { idEstudiante, descripcion, archivos } = data;

  const nuevaBitacora = bitacoraRepo.create({
    idEstudiante,
    descripcion,
    archivos: archivos || [],
  });

  await bitacoraRepo.save(nuevaBitacora);
  return nuevaBitacora;
};

export const obtenerBitacorasEstudiante = async (idEstudiante) => {
  return await bitacoraRepo.find({
    where: { idEstudiante },
    relations: ["estudiante"],
    order: { fechaSubida: "DESC" },
  });
};

// Verificar si el estudiante ya subió una bitácora en los últimos 7 días
export const verificarBitacoraReciente = async (idEstudiante) => {
  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);

  const bitacoraReciente = await bitacoraRepo.findOne({
    where: { 
      idEstudiante,
    },
    order: { fechaSubida: "DESC" },
  });

  // Si existe bitácora reciente (hace menos de 7 días)
  if (bitacoraReciente && bitacoraReciente.fechaSubida >= hace7Dias) {
    return true;
  }
  return false;
};

export const obtenerBitacoraPorId = async (idBitacora) => {
  return await bitacoraRepo.findOne({
    where: { id: parseInt(idBitacora) },
    relations: ["estudiante"],
  });
};

export const obtenerBitacoras = async () => {
  return await bitacoraRepo.find({
    relations: ["estudiante"],
    order: { fechaSubida: "DESC" },
  });
};

export const actualizarEstadoBitacora = async (idBitacora, nuevoEstado, comentarios) => {
  const bitacora = await bitacoraRepo.findOneBy({ id: parseInt(idBitacora) });
  if (!bitacora) {
    throw new Error("Bitácora no encontrada");
  }

  const estadosValidos = ["revisada", "aprobada", "rechazada"];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error("Estado no válido");
  }

  bitacora.estado = nuevoEstado;
  bitacora.comentariosEncargado = comentarios;
  bitacora.fechaRevision = new Date();

  await bitacoraRepo.save(bitacora);
  return bitacora;
};

export const eliminarBitacora = async (idBitacora) => {
  const bitacora = await bitacoraRepo.findOneBy({ id: parseInt(idBitacora) });
  if (!bitacora) {
    throw new Error("Bitácora no encontrada");
  }

  await bitacoraRepo.remove(bitacora);
};

// ===== Acciones del estudiante =====
export const actualizarBitacoraEstudiante = async (idBitacora, idEstudiante, archivos, descripcion) => {
  const bitacora = await bitacoraRepo.findOneBy({ id: parseInt(idBitacora) });
  if (!bitacora) {
    throw new Error("Bitácora no encontrada");
  }

  if (bitacora.idEstudiante !== idEstudiante) {
    throw new Error("No autorizado");
  }

  if (bitacora.estado === "aprobada") {
    throw new Error("No puedes editar una bitácora aprobada");
  }

  if (!archivos || archivos.length === 0) {
    throw new Error("Debes adjuntar al menos un archivo PDF");
  }

  bitacora.archivos = archivos;
  bitacora.descripcion = descripcion || bitacora.descripcion;
  bitacora.estado = "pendiente"; // vuelve a pendiente al reemplazar
  bitacora.comentariosEncargado = null;
  bitacora.fechaRevision = null;
  bitacora.fechaSubida = new Date();

  await bitacoraRepo.save(bitacora);
  return bitacora;
};

export const eliminarBitacoraEstudiante = async (idBitacora, idEstudiante) => {
  const bitacora = await bitacoraRepo.findOneBy({ id: parseInt(idBitacora) });
  if (!bitacora) {
    throw new Error("Bitácora no encontrada");
  }

  if (bitacora.idEstudiante !== idEstudiante) {
    throw new Error("No autorizado");
  }

  if (bitacora.estado === "aprobada") {
    throw new Error("No puedes eliminar una bitácora aprobada");
  }

  await bitacoraRepo.remove(bitacora);
};
