import { AppDataSource } from "../config/db.config.js";
import { Estudiante } from "../entities/estudiante.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { Supervisor } from "../entities/supervisor.entity.js";
import bcrypt from "bcrypt";

const estudianteRepo = AppDataSource.getRepository(Estudiante);
const encargadoRepo = AppDataSource.getRepository(Encargado);
const supervisorRepo = AppDataSource.getRepository(Supervisor);

const encryptPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const getAllUsers = async () => {
    // Ejecutamos las tres consultas en paralelo para mayor velocidad
    const [estudiantes, encargados, supervisores] = await Promise.all([
        estudianteRepo.find(),
        encargadoRepo.find(),
        supervisorRepo.find()
    ]);

    return [
        ...estudiantes.map(u => ({ ...u, rol: 'estudiante' })),
        ...encargados.map(u => ({ ...u, rol: 'encargado' })),
        ...supervisores.map(u => ({ ...u, rol: 'supervisor' }))
    ];
};

// --- Gestión de Estudiantes ---

export const createEstudiante = async (data) => {
    const exists = await estudianteRepo.findOneBy({ email: data.email });
    if (exists) throw new Error("El email ya se encuentra registrado");

    const hashedPassword = await encryptPassword(data.password);
    const newEstudiante = estudianteRepo.create({ ...data, password: hashedPassword });

    return await estudianteRepo.save(newEstudiante);
};

export const findAllEstudiantes = async () => {
    return await estudianteRepo.find({
        select: ["id", "nombre", "rut", "email", "carrera", "nivelPractica", "created_at"]
    });
};

export const deleteEstudiante = async (id) => {
    const result = await estudianteRepo.delete(id);
    if (result.affected === 0) throw new Error("Estudiante no encontrado");
};

// --- Gestión de Encargados ---

export const createEncargado = async (data) => {
    const exists = await encargadoRepo.findOneBy({ email: data.email });
    if (exists) throw new Error("El email ya se encuentra registrado");

    const hashedPassword = await encryptPassword(data.password);
    const newEncargado = encargadoRepo.create({ ...data, password: hashedPassword });

    return await encargadoRepo.save(newEncargado);
};

export const findAllEncargados = async () => {
    return await encargadoRepo.find({
        select: ["id", "nombre", "rut", "email", "facultad", "created_at"]
    });
};

export const deleteEncargado = async (id) => {
    const result = await encargadoRepo.delete(id);
    if (result.affected === 0) throw new Error("Encargado no encontrado");
};

// --- Gestión de Supervisores ---

export const createSupervisor = async (data) => {
    const exists = await supervisorRepo.findOneBy({ email: data.email });
    if (exists) throw new Error("El email ya se encuentra registrado");

    const hashedPassword = await encryptPassword(data.password);
    const newSupervisor = supervisorRepo.create({ ...data, password: hashedPassword });

    return await supervisorRepo.save(newSupervisor);
};

export const findAllSupervisores = async () => {
    return await supervisorRepo.find({
        select: ["id", "nombre", "rut", "email", "empresa", "created_at"]
    });
};

export const deleteSupervisor = async (id) => {
    const result = await supervisorRepo.delete(id);
    if (result.affected === 0) throw new Error("Supervisor no encontrado");
};

// --- Utilidades Generales ---

const getRepoByRole = (rol) => {
    const repos = {
        estudiante: estudianteRepo,
        encargado: encargadoRepo,
        supervisor: supervisorRepo
    };
    if (!repos[rol]) throw new Error("Rol de usuario no válido");
    return repos[rol];
};

export const updateUserProfile = async (id, rol, data) => {
    const repo = getRepoByRole(rol);
    const user = await repo.findOneBy({ id });
    
    if (!user) throw new Error("Usuario no encontrado");

    if (data.password) {
        data.password = await encryptPassword(data.password);
    }

    repo.merge(user, data);
    return await repo.save(user);
};

export const deleteUserAccount = async (id, rol) => {
    const repo = getRepoByRole(rol);
    const result = await repo.delete(id);
    if (result.affected === 0) throw new Error("No se pudo eliminar el usuario");
};

// Eliminación genérica (busca en todas las tablas por ID)
export const deleteUser = async (id) => {
    const [delEst, delEnc, delSup] = await Promise.all([
        estudianteRepo.delete(id),
        encargadoRepo.delete(id),
        supervisorRepo.delete(id)
    ]);

    if (delEst.affected === 0 && delEnc.affected === 0 && delSup.affected === 0) {
        throw new Error("Usuario no encontrado en ningún registro");
    }
};