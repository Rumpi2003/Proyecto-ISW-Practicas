import { AppDataSource } from "../config/configDb.js";


const repo = () => AppDataSource.getRepository("Evaluacion");

export async function findEvaluacionesPendientes() {
  return repo().find({ where: { estado: "pendiente_encargado" } });
}

export async function findEvaluacionById(id) {
  const idNum = Number(id);
  if (Number.isNaN(idNum)) return null;
  return repo().findOne({ where: { id: idNum } });
}

export async function evaluarAlumno(id, notaEncargado) {
  const idNum = Number(id);
  const r = repo();

  const e = await r.findOne({ where: { id: idNum } });
  if (!e) throw new Error("Evaluación no encontrada");

  e.nota_encargado = String(notaEncargado);

  const sup = parseFloat(e.nota_supervisor);
  const enc = parseFloat(e.nota_encargado);

  if (!Number.isNaN(sup) && !Number.isNaN(enc)) {
    e.nota_final = Number(((sup + enc) / 2).toFixed(1));
    e.estado = "completado";
  } else {
    e.nota_final = null;
    e.estado = "pendiente_encargado";
  }

  return r.save(e);
}
