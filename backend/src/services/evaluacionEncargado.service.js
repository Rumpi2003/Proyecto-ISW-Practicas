import { AppDataSource } from "../config/db.config.js";
import { Solicitud } from "../entities/solicitud.entity.js";
import { Evaluacion } from "../entities/evaluacionEncargado.entity.js";
import { Not, IsNull } from "typeorm";

const solicitudRepo = AppDataSource.getRepository(Solicitud);
const evaluacionRepo = AppDataSource.getRepository(Evaluacion);

/**
 * 1) Obtener lista de pendientes
 * Filtra solo solicitudes que estén listas para evaluación final.
 */
export async function obtenerPendientes() {
    return await solicitudRepo.find({
        where: { estado: "pendiente_evaluacion" },
        relations: ["estudiante"],
    });
}

/**
 * Helpers para distinguir documentos (según nombre o ruta).
 * Nota: "documentos" viene como text[] (strings) en PostgreSQL.
 */
function isInformeFinal(doc) {
    if (!doc) return false;
    const url = (typeof doc === "string" ? doc : (doc.url || doc.path || "")).toLowerCase();
    return url.includes("informe") || url.includes("final");
}

function getDocUrl(doc) {
    if (!doc) return null;
    if (typeof doc === "string") return doc;
    return doc.url || doc.path || null;
}

/**
 * 2) Obtener detalles: estudiante + documentos + fecha límite
 * (La nota del supervisor se usa en backend para validar y promediar,
 * pero si no quieres mostrarla en frontend, igual puedes retornarla o no.)
 */
export async function obtenerDetallesPractica(id) {
    const solicitud = await solicitudRepo.findOne({
        where: { id: Number(id) },
        relations: ["estudiante"],
    });

    if (!solicitud) return null;

    const evaluacion = await evaluacionRepo.findOne({
        where: { solicitud: { id: Number(id) } },
    });

    const docs = Array.isArray(solicitud.documentos) ? solicitud.documentos : [];

    // Informe: detectamos uno; el resto se considera bitácoras (más robusto)
    const informeDoc = docs.find(isInformeFinal) || null;
    const informeFinal = getDocUrl(informeDoc);

    const bitacoras = docs
        .filter((doc) => doc !== informeDoc)
        .map(getDocUrl)
        .filter(Boolean);

    return {
        estudiante: solicitud.estudiante,
        informeFinal,
        bitacoras,
        // Puedes dejar esto o quitarlo si no quieres enviarlo al frontend
        notaSupervisor: evaluacion ? evaluacion.notaSupervisor : null,
        estado: solicitud.estado,
        fechaEnvio: solicitud.fechaEnvio,
        fechaLimiteEvaluacion: solicitud.fechaLimiteEvaluacion ?? null,
    };
}

/**
 * 3) Calificar práctica
 * Promedia nota del encargado con la del supervisor y guarda nota final.
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

    if (!evaluacion) {
        evaluacion = evaluacionRepo.create({
            solicitud: { id: Number(idSolicitud) },
        });
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