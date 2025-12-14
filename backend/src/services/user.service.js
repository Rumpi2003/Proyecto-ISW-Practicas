// src/services/user.service.js
import { AppDataSource } from "../config/db.config.js";
import { Estudiante } from "../entities/estudiante.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { Supervisor } from "../entities/supervisor.entity.js";
import bcrypt from "bcrypt";

// Repositorios
const estudianteRepo = AppDataSource.getRepository(Estudiante);
const encargadoRepo = AppDataSource.getRepository(Encargado);
const supervisorRepo = AppDataSource.getRepository(Supervisor);

async function encryptPassword(password) {
  return await bcrypt.hash(password, 10);
}

// ================= ESTUDIANTES =================
export async function createEstudiante(data) {
  const exists = await estudianteRepo.findOneBy({ email: data.email });
  if (exists) throw new Error("El email ya existe en estudiantes");

  const hashedPassword = await encryptPassword(data.password);

  const newEstudiante = estudianteRepo.create({
    nombre: data.nombre,
    rut: data.rut,
    email: data.email,
    password: hashedPassword,
    carrera: data.carrera,
    nivelPractica: data.nivelPractica,
  });

  return await estudianteRepo.save(newEstudiante);
}

export async function deleteEstudiante(id) {
  const estudiante = await estudianteRepo.findOneBy({ id });
  if (!estudiante) throw new Error("Estudiante no encontrado");
  await estudianteRepo.remove(estudiante);
}

export async function findAllEstudiantes() {
  return await estudianteRepo.find({
    select: ["id", "nombre", "rut", "email", "carrera", "nivelPractica", "created_at"]
  });
}

// ================= ENCARGADOS =================
export async function createEncargado(data) {
  const exists = await encargadoRepo.findOneBy({ email: data.email });
  if (exists) throw new Error("El email ya existe en encargados");

  const hashedPassword = await encryptPassword(data.password);

  const newEncargado = encargadoRepo.create({
    nombre: data.nombre,
    rut: data.rut,
    email: data.email,
    password: hashedPassword,
    facultad: data.facultad,
  });

  return await encargadoRepo.save(newEncargado);
}

export async function deleteEncargado(id) {
  const encargado = await encargadoRepo.findOneBy({ id });
  if (!encargado) throw new Error("Encargado no encontrado");
  await encargadoRepo.remove(encargado);
}

export async function findAllEncargados() {
  return await encargadoRepo.find({
    select: ["id", "nombre", "rut", "email", "facultad", "created_at"]
  });
}

// ================= SUPERVISORES =================
export async function createSupervisor(data) {
  const exists = await supervisorRepo.findOneBy({ email: data.email });
  if (exists) throw new Error("El email ya existe en supervisores");

  const hashedPassword = await encryptPassword(data.password);

  const newSupervisor = supervisorRepo.create({
    nombre: data.nombre,
    rut: data.rut,
    email: data.email,
    password: hashedPassword,
    empresa: data.empresa,
  });

  return await supervisorRepo.save(newSupervisor);
}

export async function deleteSupervisor(id) {
  const supervisor = await supervisorRepo.findOneBy({ id });
  if (!supervisor) throw new Error("Supervisor no encontrado");
  await supervisorRepo.remove(supervisor);
}

export async function findAllSupervisores() {
  return await supervisorRepo.find({
    select: ["id", "nombre", "rut", "email", "empresa", "created_at"]
  });
}


//================== funciones genericas =================
//seleccionar el repositorio correcto según el rol
const getRepoByRole = (rol) => {
  switch (rol) {
    case 'estudiante': return estudianteRepo;
    case 'encargado': return encargadoRepo;
    case 'supervisor': return supervisorRepo;
    default: throw new Error("Rol no válido para esta operación");
  }
};

export async function updateUserProfile(id, rol, data) {
  const repo = getRepoByRole(rol);
  
  const user = await repo.findOneBy({ id });
  if (!user) throw new Error("Usuario no encontrado");

  if (data.password) {
    data.password = await encryptPassword(data.password);
  }

  //actualizar
  repo.merge(user, data);
  return await repo.save(user);
}

export async function deleteUserAccount(id, rol) {
  const repo = getRepoByRole(rol);
  
  const user = await repo.findOneBy({ id });
  if (!user) throw new Error("Usuario no encontrado");
  
  await repo.remove(user);
}