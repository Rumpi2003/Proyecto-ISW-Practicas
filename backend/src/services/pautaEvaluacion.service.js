import { AppDataSource } from "../config/db.config.js";
import { PautaEvaluacion } from "../entities/pautaEvaluacion.entity.js";

// Repositorio
const pautaEvaluacionRepo = AppDataSource.getRepository(PautaEvaluacion);

export const createPautaEvaluacion = async (data) => {
    const { nombre, carrera, nivelPractica, aspectos_a_evaluar } = data;
    if (await pautaEvaluacionRepo.findOneBy({ nombre })) {
        throw new Error("Ya existe una pauta de evaluación con ese nombre");
    }
    if (!Array.isArray(aspectos_a_evaluar) || aspectos_a_evaluar.length === 0) {
        throw new Error("aspectos_a_evaluar debe ser un arreglo no vacío");
    }
    if (await pautaEvaluacionRepo.findOneBy({ carrera, nivelPractica })) {
        throw new Error("Ya existe una pauta de evaluación para esa carrera y nivel de práctica");
    }
    const pauta = pautaEvaluacionRepo.create({
        nombre,
        carrera,
        nivelPractica,
        aspectos_a_evaluar
    });
    return await pautaEvaluacionRepo.save(pauta);
};

export const findPautasEvaluacion = async () => {
    return await pautaEvaluacionRepo.find({
        order: { updated_at: "DESC" }
    });
}

export const findPautaEvaluacionById = async (id) => {
    const pauta = await pautaEvaluacionRepo.findOneBy({ id });
    if (!pauta) {
        throw new Error("Pauta de evaluación no encontrada");
    }
    return pauta;
}

export const updatePautaEvaluacion = async (id, data) => {
    const pauta = await pautaEvaluacionRepo.findOneBy({ id });
    if (!pauta) {
        throw new Error("Pauta de evaluación no encontrada");
    }
    pautaEvaluacionRepo.merge(pauta, data);
    return await pautaEvaluacionRepo.save(pauta);
};

export const deletePautaEvaluacion = async (id) => {
    const pauta = await pautaEvaluacionRepo.findOneBy({ id });
    if (!pauta) {
        throw new Error("Pauta de evaluación no encontrada");
    }
    return await pautaEvaluacionRepo.remove(pauta);
};