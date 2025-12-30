import { AppDataSource } from "../config/db.config.js";
import { EvaluacionSupervisor } from "../entities/evaluacionSupervisor.entity.js";


const evaluacionSupervisorRepo = AppDataSource.getRepository(EvaluacionSupervisor);

export const createEvaluacionSupervisor = async (data) => {
    // Verificar si el estudiante ya tiene una evaluación pendiente
    if (!data || !data.idEstudiante) {
        throw new Error('CLIENT:Datos de evaluación incompletos');
    }
    const existing = await evaluacionSupervisorRepo.findOne({ where: { idEstudiante: data.idEstudiante, estado: 'pendiente' } });
    if (existing) {
        throw new Error('CLIENT:El estudiante ya tiene una evaluación pendiente');
    }
    const evaluacion = evaluacionSupervisorRepo.create(data);
    return await evaluacionSupervisorRepo.save(evaluacion);
};

export const findEvaluacionesSupervisor = async () => {
    return await evaluacionSupervisorRepo.find({
        order: { created_at: "DESC" },
        relations: ['pauta', 'estudiante', 'supervisor']
    });
}

export const findAllEvaluacionSupervisorByIdSupervisor = async (id) => {
    return await evaluacionSupervisorRepo.find({
        where: { idSupervisor: id },
        relations: ['pauta', 'estudiante', 'supervisor'],
        order: { created_at: 'DESC' }
    });
}

export const findEvaluacionSupervisorById = async (id) => {
    const evaluacion = await evaluacionSupervisorRepo.findOne({ where: { id }, relations: ['pauta', 'estudiante', 'supervisor'] });
    if (!evaluacion) {
        throw new Error("Evaluación de supervisor no encontrada");
    }
    return evaluacion;
}
export const updateEvaluacionSupervisor = async (id, data) => {
    const evaluacion = await evaluacionSupervisorRepo.findOneBy({ id });
    if (!evaluacion) {
        throw new Error("Evaluación de supervisor no encontrada");
    }
    evaluacionSupervisorRepo.merge(evaluacion, data);
    return await evaluacionSupervisorRepo.save(evaluacion);
};

export const deleteEvaluacionSupervisor = async (id) => {
    const evaluacion = await evaluacionSupervisorRepo.findOneBy({ id });
    if (!evaluacion) {
        throw new Error("Evaluación de supervisor no encontrada");
    }
    return await evaluacionSupervisorRepo.remove(evaluacion);
};
