import { AppDataSource } from "../config/db.config.js";
import { PautaEvaluacion } from "../entities/pautaEvaluacion.entity.js";

// Repositorio
const pautaEvaluacionRepo = AppDataSource.getRepository(PautaEvaluacion);

export const createPautaEvaluacion = async (data) => {
    const { nombre, carrera, idCarrera, nivelPractica, aspectos_a_evaluar } = data;
    const resolvedIdCarrera = Number(idCarrera ?? carrera) || null;

    if (!resolvedIdCarrera) {
        throw new Error("idCarrera (carrera) es requerido");
    }

    if (await pautaEvaluacionRepo.findOneBy({ nombre })) {
        throw new Error("Ya existe una pauta de evaluación con ese nombre");
    }

    if (!Array.isArray(aspectos_a_evaluar) || aspectos_a_evaluar.length === 0) {
        throw new Error("aspectos_a_evaluar debe ser un arreglo no vacío");
    }

    if (await pautaEvaluacionRepo.findOne({ where: { idCarrera: resolvedIdCarrera, nivelPractica } })) {
        throw new Error("Ya existe una pauta de evaluación para esa carrera y nivel de práctica");
    }

    const pauta = pautaEvaluacionRepo.create({
        nombre,
        idCarrera: resolvedIdCarrera,
        nivelPractica,
        aspectos_a_evaluar
    });
    return await pautaEvaluacionRepo.save(pauta);
};

export const findPautasEvaluacion = async () => {
    return await pautaEvaluacionRepo.find({
        relations: ['carrera'],
        order: { updated_at: "DESC" }
    });
}

export const findPautaEvaluacionById = async (id) => {
    const pauta = await pautaEvaluacionRepo.findOne({ where: { id }, relations: ['carrera'] });
    if (!pauta) {
        throw new Error("Pauta de evaluación no encontrada");
    }
    return pauta;
}

export const updatePautaEvaluacion = async (id, data) => {
    const pauta = await pautaEvaluacionRepo.findOne({ where: { id } });
    if (!pauta) {
        throw new Error("Pauta de evaluación no encontrada");
    }

    // Normalizar posible campo `carrera` enviado desde el cliente hacia `idCarrera`
    if (data.carrera !== undefined || data.idCarrera !== undefined) {
        const resolved = Number(data.idCarrera ?? data.carrera) || null;
        if (!resolved) throw new Error('idCarrera (carrera) inválido');
        data.idCarrera = resolved;
        delete data.carrera;
    }

    pautaEvaluacionRepo.merge(pauta, data);
    return await pautaEvaluacionRepo.save(pauta);
};

export const deletePautaEvaluacion = async (id) => {
    const pauta = await pautaEvaluacionRepo.findOne({ where: { id } });
    if (!pauta) {
        throw new Error("Pauta de evaluación no encontrada");
    }
    return await pautaEvaluacionRepo.remove(pauta);
};