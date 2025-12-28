import { AppDataSource } from "../config/db.config.js";
import { Solicitud } from "../entities/solicitud.entity.js";
import { Evaluacion } from "../entities/evaluacionEncargado.entity.js";
import { Not, IsNull } from "typeorm";

const solicitudRepo = AppDataSource.getRepository(Solicitud);
const evaluacionRepo = AppDataSource.getRepository(Evaluacion);

/**
 * 1) Obtener lista de pendientes
 * - Ajusta el estado según tu flujo real
 */
export async function obtenerPendientes() {
    return await solicitudRepo.find({
        where: { estado: "pendiente_evaluacion" },
        relations: ["estudiante"],
    });
}

/**
 * Helper: detectar tipo de documento
 */
function isInformeFinal(doc) {
    if (!doc) return false;
    const t = (doc.tipo || doc.type || doc.nombre || "").toString().toLowerCase();
    const url = (doc.url || doc.path || doc).toString().toLowerCase();
    return t.includes("informe") || t.includes("final") || url.includes("informe");
}

function isBitacora(doc) {
    if (!doc) return false;
    const t = (doc.tipo || doc.type || doc.nombre || "").toString().toLowerCase();
    const url = (doc.url || doc.path || doc).toString().toLowerCase();
    return t.includes("bitac") || url.includes("bitac");
}

function getDocUrl(doc) {
    if (!doc) return null;
    if (typeof doc === "string") return doc;
    return doc.url || doc.path || null;
}

/**
 * 2) Obtener detalles: estudiante + documentos + nota supervisor + fecha límite
 */
export async function obtenerDetallesPractica(id) {
    const solicitud = await solicitudRepo.findOne({
        where: { id: Number(id) },
        relations: ["estudiante"],
    });

    if (!solicitud) return null;

    // Traemos evaluación si existe (ahí viene nota supervisor)
    const evaluacion = await evaluacionRepo.findOne({
        where: { solicitud: { id: Number(id) } },
    });

    // Documentos: evitamos depender de [0] y [1]
    const docs = Array.isArray(solicitud.documentos) ? solicitud.documentos : [];

    const informeDoc = docs.find(isInformeFinal) || null;
    const bitacoraDocs = docs.filter(isBitacora);

    const informeFinal = getDocUrl(informeDoc);
    const bitacoras = bitacoraDocs.map(getDocUrl).filter(Boolean);

    return {
        estudiante: solicitud.estudiante,
        informeFinal,
        bitacoras,
        notaSupervisor: evaluacion ? evaluacion.notaSupervisor : null,
        estado: solicitud.estado,
        fechaEnvio: solicitud.fechaEnvio,
        // CAMPO PARA PLAZO (debe existir en entidad o esto vendrá undefined)
        fechaLimiteEvaluacion: solicitud.fechaLimiteEvaluacion ?? null,
    };
}

/**
 * 3) Calificar práctica (promedio + nota final + plazo)
 */
export async function calificarPractica(idSolicitud, notaEncargado, urlPauta = null, comentarios = null) {
    const solicitud = await solicitudRepo.findOne({
        where: { id: Number(idSolicitud) },
        relations: ["estudiante"],
    });

    if (!solicitud) {
        throw new Error("No encontrado");
    }

    // Validación de plazo
    const ahora = new Date();
    if (solicitud.fechaLimiteEvaluacion && ahora > new Date(solicitud.fechaLimiteEvaluacion)) {
        throw new Error("Plazo vencido");
    }

    let evaluacion = await evaluacionRepo.findOne({
        where: { solicitud: { id: Number(idSolicitud) } },
        relations: ["solicitud"],
    });

    // Si no existe registro (por si el supervisor no lo creó aún)
    if (!evaluacion) {
        evaluacion = evaluacionRepo.create({
            solicitud: { id: Number(idSolicitud) },
        });
    }

    // Requisito: debe existir nota del supervisor
    if (!evaluacion.notaSupervisor) {

        throw new Error("El supervisor aún no ha ingresado su calificación.");
    }

    const nEncargado = parseFloat(notaEncargado);
    const nSupervisor = parseFloat(evaluacion.notaSupervisor);
    const promedio = (nEncargado + nSupervisor) / 2;

    evaluacion.notaEncargado = nEncargado;
    evaluacion.notaFinal = Number(promedio.toFixed(1));
    evaluacion.comentarios = comentarios ?? evaluacion.comentarios ?? null;
    evaluacion.fechaEvaluacion = new Date();

    if (urlPauta) {
        evaluacion.urlPauta = urlPauta;
    }

    const evaluacionGuardada = await evaluacionRepo.save(evaluacion);

    // Estado final
    solicitud.estado = "finalizada";
    await solicitudRepo.save(solicitud);

    return evaluacionGuardada;
}

/**
 * 4) Historial de evaluaciones
 */
export async function getHistorialEvaluaciones() {
    return await evaluacionRepo.find({
        where: { notaFinal: Not(IsNull()) },
        relations: ["solicitud", "solicitud.estudiante"],
    });
}
