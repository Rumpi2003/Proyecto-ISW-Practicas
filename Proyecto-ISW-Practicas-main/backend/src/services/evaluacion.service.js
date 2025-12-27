import { AppDataSource } from "../config/db.config.js";
import { Solicitud } from "../entities/solicitud.entity.js";
import { IsNull, Not } from "typeorm";

const solicitudRepository = AppDataSource.getRepository(Solicitud);

// Obtener solicitudes pendientes de evaluación final (Nota Supervisor OK, Nota Final NULL)
export async function obtenerPendientes() {
    return await solicitudRepository.find({
        where: {
            notaSupervisor: Not(IsNull()),
            notaFinal: IsNull(),
        },
        relations: ["estudiante"],
    });
}

// Obtener detalles completos de una evaluación específica
export async function obtenerDetalleEvaluacion(idSolicitud) {
    const solicitud = await solicitudRepository.findOne({
        where: { id: idSolicitud },
        relations: ["estudiante"],
    });

    if (!solicitud) return null;

    return {
        estudiante: solicitud.estudiante,
        docs: {
            informe: solicitud.urlInformeFinal,
            bitacoras: solicitud.urlsBitacoras || []
        },
        notas: {
            supervisor: solicitud.notaSupervisor,
            encargado: solicitud.notaEncargado,
            final: solicitud.notaFinal
        },
        estado: solicitud.estado,
        fechaLimite: solicitud.fechaLimiteEvaluacion
    };
}

// Registrar nota del encargado, calcular promedio y cerrar evaluación
export async function registrarNotaEncargado(idSolicitud, notaEncargado) {
    const solicitud = await solicitudRepository.findOne({ where: { id: idSolicitud } });

    if (!solicitud) throw new Error("Solicitud no encontrada");

    // Verificación de seguridad
    if (!solicitud.notaSupervisor) throw new Error("Falta la calificación del supervisor externo");

    const fechaActual = new Date();

    // Validar si está dentro del plazo
    if (solicitud.fechaLimiteEvaluacion && fechaActual > solicitud.fechaLimiteEvaluacion) {
        throw new Error("El plazo de evaluación ha vencido");
    }

    const nSup = parseFloat(solicitud.notaSupervisor);
    const nEnc = parseFloat(notaEncargado);

    // Promedio simple (50% Supervisor / 50% Encargado)
    const promedio = (nSup + nEnc) / 2;

    solicitud.notaEncargado = nEnc;
    solicitud.notaFinal = parseFloat(promedio.toFixed(1));
    solicitud.estado = "evaluada";
    solicitud.fechaRevision = fechaActual;

    return await solicitudRepository.save(solicitud);
}

// Obtener historial histórico de evaluaciones completadas
export const getHistorialEvaluaciones = async () => {
    return await solicitudRepository.find({
        where: {
            notaFinal: Not(IsNull())
        },
        relations: ["estudiante"],
        order: {
            id: "DESC"
        }
    });
};