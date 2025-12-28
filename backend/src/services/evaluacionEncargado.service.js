import { AppDataSource } from "../config/db.config.js";
import { Solicitud } from "../entities/solicitud.entity.js";
import { Evaluacion } from "../entities/evaluacionEncargado.entity.js";
import { Not, IsNull } from "typeorm";

const solicitudRepo = AppDataSource.getRepository(Solicitud);
const evaluacionRepo = AppDataSource.getRepository(Evaluacion);

// 1. Obtener lista de pendientes
export async function obtenerPendientes() {
    // Busca solicitudes en estado de espera para ser evaluadas
    const pendientes = await solicitudRepo.find({
        where: { estado: "pendiente_evaluacion" }, 
        relations: ["estudiante"]
    });
    return pendientes;
}

// 2. Obtener detalles (VISUALIZACIÓN DE DOCUMENTOS)
export async function obtenerDetallesPractica(id) {
    const solicitud = await solicitudRepo.findOne({
        where: { id: Number(id) },
        relations: ["estudiante"]
    });

    if (!solicitud) return null;

    // Buscamos la evaluación que ya tiene la nota del supervisor
    const evaluacion = await evaluacionRepo.findOne({
        where: { solicitud: { id: Number(id) } }
    });

    return {
        estudiante: solicitud.estudiante,
        // Accedemos al array de documentos subidos por el alumno
        // Asumimos: [0] Informe Final, [1] Bitácoras
        informeFinal: solicitud.documentos && solicitud.documentos[0] ? solicitud.documentos[0] : null,
        bitacoras: solicitud.documentos && solicitud.documentos[1] ? solicitud.documentos[1] : null,
        notaSupervisor: evaluacion ? evaluacion.notaSupervisor : null,
        estado: solicitud.estado,
        fechaEnvio: solicitud.fechaEnvio 
    };
}

// 3. Calificar (PROMEDIO Y NOTA FINAL)
export async function calificarPractica(idSolicitud, notaEncargado, urlPauta, comentarios) {

    let evaluacion = await evaluacionRepo.findOne({
        where: { solicitud: { id: Number(idSolicitud) } },
        relations: ["solicitud"]
    });

    // Si por alguna razón el supervisor no creó el registro, lo creamos nosotros
    if (!evaluacion) {
        evaluacion = evaluacionRepo.create({
            solicitud: { id: Number(idSolicitud) }
        });
    }

    // Requisito: Debe existir nota del supervisor para promediar
    if (!evaluacion.notaSupervisor) {
        throw new Error("El supervisor aún no ha ingresado su calificación.");
    }

    // Cálculo matemático del promedio
    const nEncargado = parseFloat(notaEncargado);
    const nSupervisor = parseFloat(evaluacion.notaSupervisor);
    const promedio = (nEncargado + nSupervisor) / 2;

    // Actualización de la evaluación
    evaluacion.notaEncargado = nEncargado;
    evaluacion.notaFinal = promedio.toFixed(1); 
    evaluacion.comentarios = comentarios;
    evaluacion.fechaEvaluacion = new Date();
    
    // Guardamos la URL de la pauta que subió el encargado
    if (urlPauta) {
        evaluacion.urlPauta = urlPauta;
    }

    const evaluacionGuardada = await evaluacionRepo.save(evaluacion);

    // Finalizamos el estado de la solicitud
    const solicitud = await solicitudRepo.findOneBy({ id: Number(idSolicitud) });
    if (solicitud) {
        solicitud.estado = "finalizada";
        await solicitudRepo.save(solicitud);
    }

    return evaluacionGuardada;
}

// 4. Historial de Evaluaciones
export async function getHistorialEvaluaciones() {
    return await evaluacionRepo.find({
        where: {
            notaFinal: Not(IsNull())
        },
        relations: ["solicitud", "solicitud.estudiante"]
    });
}