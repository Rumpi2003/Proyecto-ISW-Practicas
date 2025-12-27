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

// MODIFICADO: Ahora incluimos la relación con carrera
export async function findAllEstudiantes() {
  return await estudianteRepo.find({
    relations: ["carrera"] 
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

// MODIFICADO: Ahora incluimos la relación con facultad
export async function findAllEncargados() {
  return await encargadoRepo.find({
    relations: ["facultad"]
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
  return await supervisorRepo.find(); // Los supervisores no tienen relaciones externas simples por ahora
}


//================== funciones genericas =================
const getRepoByRole = (rol) => {
  switch (rol) {
    case 'estudiante': return estudianteRepo;
    case 'encargado': return encargadoRepo;
    case 'supervisor': return supervisorRepo;
    default: throw new Error("Rol no válido para esta operación");
  }
};

// MODIFICADO: Para que al actualizar el perfil se devuelva con sus relaciones
export async function updateUserProfile(id, rol, data) {
  const repo = getRepoByRole(rol);
  
  // Usamos findOne con relations según el rol
  const user = await repo.findOne({ 
    where: { id },
    relations: rol === 'encargado' ? ["facultad"] : rol === 'estudiante' ? ["carrera"] : []
  });

  if (!user) throw new Error("Usuario no encontrado");

  if (data.password) {
    data.password = await encryptPassword(data.password);
  }

  repo.merge(user, data);
  const updatedUser = await repo.save(user);
  
  // Ocultar password antes de retornar
  delete updatedUser.password;
  return updatedUser;
}

export async function deleteUserAccount(id, rol) {
  const repo = getRepoByRole(rol);
  
  const user = await repo.findOneBy({ id });
  if (!user) throw new Error("Usuario no encontrado");
  
  await repo.remove(user);
}