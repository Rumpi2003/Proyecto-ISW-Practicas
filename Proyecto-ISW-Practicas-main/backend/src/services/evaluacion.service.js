import { AppDataSource } from "../config/db.config.js";
import { Solicitud } from "../entities/solicitud.entity.js";
import { IsNull, Not } from "typeorm";

const solicitudRepository = AppDataSource.getRepository(Solicitud);

// 1. Obtener pendientes (CORREGIDA: usa 'nombre')
export async function obtenerPendientes() {
    return await solicitudRepository.find({
        where: {
            notaSupervisor: Not(IsNull()),
            notaFinal: IsNull(),
        },
        relations: ["estudiante"],
        select: {
            id: true,
            fechaLimiteEvaluacion: true,
            notaSupervisor: true,
            estudiante: {
                id: true,
                nombre: true, // <--- Aquí estaba el error, ahora está arreglado
                carrera: true,
                rut: true
            }
        }
    });
}

// 2. Obtener detalle de una evaluación
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

// 3. Registrar la nota del encargado
export async function registrarNotaEncargado(idSolicitud, notaEncargado) {
    const solicitud = await solicitudRepository.findOne({ where: { id: idSolicitud } });

    if (!solicitud) throw new Error("No encontrado");

    if (!solicitud.notaSupervisor) throw new Error("Falta nota supervisor");

    const fechaActual = new Date();
    // Validar plazo (opcional, depende de tus reglas)
    if (solicitud.fechaLimiteEvaluacion && fechaActual > solicitud.fechaLimiteEvaluacion) {
        throw new Error("Plazo vencido");
    }

    const nSup = parseFloat(solicitud.notaSupervisor);
    const nEnc = parseFloat(notaEncargado);
    
    // Calcular promedio simple
    const promedio = (nSup + nEnc) / 2;

    solicitud.notaEncargado = nEnc;
    solicitud.notaFinal = parseFloat(promedio.toFixed(1));
    solicitud.estado = "evaluada"; // Cambiamos el estado
    solicitud.fechaRevision = fechaActual;

    return await solicitudRepository.save(solicitud);
}