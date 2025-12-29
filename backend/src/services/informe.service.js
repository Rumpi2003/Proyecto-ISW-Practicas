import { AppDataSource } from "../config/db.config.js";
import { Informe } from "../entities/informe.entity.js";

const informeRepo = AppDataSource.getRepository(Informe);

export const crearInforme = async (data) => {
  const { idEstudiante, descripcion, archivo } = data;

  const nuevoInforme = informeRepo.create({
    idEstudiante,
    descripcion,
    archivo,
  });

  await informeRepo.save(nuevoInforme);
  return nuevoInforme;
};

export const obtenerInformesEstudiante = async (idEstudiante) => {
  return await informeRepo.find({
    where: { idEstudiante },
    relations: ["estudiante"],
    order: { fechaSubida: "DESC" },
  });
};

export const obtenerInformePorId = async (idInforme) => {
  return await informeRepo.findOne({
    where: { id: parseInt(idInforme) },
    relations: ["estudiante"],
  });
};

export const obtenerInformes = async () => {
  return await informeRepo.find({
    relations: ["estudiante"],
    order: { fechaSubida: "DESC" },
  });
};

export const actualizarEstadoInforme = async (idInforme, nuevoEstado, comentarios) => {
  const informe = await informeRepo.findOneBy({ id: parseInt(idInforme) });
  if (!informe) {
    throw new Error("Informe no encontrado");
  }

  const estadosValidos = ["revisado", "aprobado", "rechazado"];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error("Estado no válido");
  }

  informe.estado = nuevoEstado;
  informe.comentariosEncargado = comentarios;
  informe.fechaRevision = new Date();

  await informeRepo.save(informe);
  return informe;
};

export const eliminarInforme = async (idInforme) => {
  const informe = await informeRepo.findOneBy({ id: parseInt(idInforme) });
  if (!informe) {
    throw new Error("Informe no encontrado");
  }

  await informeRepo.remove(informe);
};

// ===== Acciones del estudiante =====
export const actualizarInformeEstudiante = async (idInforme, idEstudiante, archivo, descripcion) => {
  const informe = await informeRepo.findOneBy({ id: parseInt(idInforme) });
  if (!informe) {
    throw new Error("Informe no encontrado");
  }

  if (informe.idEstudiante !== idEstudiante) {
    throw new Error("No autorizado");
  }

  if (informe.estado === "aprobado") {
    throw new Error("No puedes editar un informe aprobado");
  }

  if (!archivo) {
    throw new Error("Debes adjuntar un archivo PDF");
  }

  informe.archivo = archivo;
  informe.descripcion = descripcion || informe.descripcion;
  informe.estado = "pendiente"; // vuelve a pendiente al reemplazar
  informe.comentariosEncargado = null;
  informe.fechaRevision = null;
  informe.fechaSubida = new Date();

  await informeRepo.save(informe);
  return informe;
};

export const eliminarInformeEstudiante = async (idInforme, idEstudiante) => {
  const informe = await informeRepo.findOneBy({ id: parseInt(idInforme) });
  if (!informe) {
    throw new Error("Informe no encontrado");
  }

  if (informe.idEstudiante !== idEstudiante) {
    throw new Error("No autorizado");
  }

  if (informe.estado === "aprobado") {
    throw new Error("No puedes eliminar un informe aprobado");
  }

  await informeRepo.remove(informe);
};
