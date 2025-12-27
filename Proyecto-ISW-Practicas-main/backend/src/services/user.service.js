import { AppDataSource } from "../config/db.config.js";
import { Estudiante } from "../entities/estudiante.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { Supervisor } from "../entities/supervisor.entity.js";
import bcrypt from "bcrypt";

// ==========================================
// 1. REPOSITORIOS
// ==========================================
const estudianteRepo = AppDataSource.getRepository(Estudiante);
const encargadoRepo = AppDataSource.getRepository(Encargado);
const supervisorRepo = AppDataSource.getRepository(Supervisor);

// Helper para encriptar contraseñas
async function encryptPassword(password) {
    return await bcrypt.hash(password, 10);
}

// ==========================================
// 2. FUNCIÓN UNIFICADA
// ==========================================
export async function getAllUsers() {
    const estudiantes = await estudianteRepo.find();
    const encargados = await encargadoRepo.find();
    const supervisores = await supervisorRepo.find();

    const listaEstudiantes = estudiantes.map(u => ({ ...u, rol: 'estudiante' }));
    const listaEncargados = encargados.map(u => ({ ...u, rol: 'encargado' }));
    const listaSupervisores = supervisores.map(u => ({ ...u, rol: 'supervisor' }));

    return [...listaEstudiantes, ...listaEncargados, ...listaSupervisores];
}

// ==========================================
// 3. MÓDULO ESTUDIANTES
// ==========================================
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

// ==========================================
// 4. MÓDULO ENCARGADOS
// ==========================================
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

// ==========================================
// 5. MÓDULO SUPERVISORES
// ==========================================
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

// ==========================================
// 6. FUNCIONES GENÉRICAS (Update/Delete)
// ==========================================
export async function deleteUser(id) {
    // Buscar y borrar en Estudiante
    const estudiante = await estudianteRepo.findOneBy({ id });
    if (estudiante) return await estudianteRepo.remove(estudiante);

    // Buscar y borrar en Encargado
    const encargado = await encargadoRepo.findOneBy({ id });
    if (encargado) return await encargadoRepo.remove(encargado);

    // Buscar y borrar en Supervisor
    const supervisor = await supervisorRepo.findOneBy({ id });
    if (supervisor) return await supervisorRepo.remove(supervisor);

    throw new Error("No se encontró el usuario con ese ID en ninguna tabla");
}

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

    repo.merge(user, data);
    return await repo.save(user);
}

export async function deleteUserAccount(id, rol) {
    const repo = getRepoByRole(rol);
    const user = await repo.findOneBy({ id });
    if (!user) throw new Error("Usuario no encontrado");
    await repo.remove(user);
}