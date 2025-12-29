// backend/src/services/evaluacionEncargado.service.js
import { AppDataSource } from "../config/db.config.js";
import { Solicitud } from "../entities/solicitud.entity.js";
import { Evaluacion } from "../entities/evaluacionEncargado.entity.js";
import { Bitacora } from "../entities/bitacora.entity.js";
import { Informe } from "../entities/informe.entity.js";
import { Not, IsNull } from "typeorm";

const solicitudRepo = AppDataSource.getRepository(Solicitud);
const evaluacionRepo = AppDataSource.getRepository(Evaluacion);
const bitacoraRepo = AppDataSource.getRepository(Bitacora);
const informeRepo = AppDataSource.getRepository(Informe);

/**
 * Pendientes para el encargado:
 * Se considera pendiente si el supervisor ya evaluó pero el encargado aún no.
 */
export async function obtenerPendientes() {
    const solicitudes = await solicitudRepo.find({
        relations: ["estudiante"],
    });

    const pendientes = [];

    for (const solicitud of solicitudes) {
        // Buscamos la evaluación asociada a la solicitud
        const evaluacion = await evaluacionRepo.findOne({
            where: { solicitud: { id: solicitud.id } }
        });

        // 1) Si no existe evaluación (supervisor no ha evaluado) o el encargado ya puso nota, saltamos
        if (!evaluacion || evaluacion.notaEncargado != null) continue;

        // 2) Verificamos si hay archivos (en Solicitud, Bitacora o Informe)
        // Usamos el ID del estudiante para el fallback
        const idEst = solicitud.estudiante?.id;
        
        const tieneDocsEnSolicitud = Array.isArray(solicitud.documentos) && solicitud.documentos.length > 0;
        
        let tieneDocsEnModulos = false;
        if (!tieneDocsEnSolicitud && idEst) {
            const [bitacora, informe] = await Promise.all([
                bitacoraRepo.findOne({ where: { estudiante: { id: idEst } } }),
                informeRepo.findOne({ where: { estudiante: { id: idEst } } })
            ]);
            tieneDocsEnModulos = !!bitacora || !!informe;
        }

        if (tieneDocsEnSolicitud || tieneDocsEnModulos) {
            pendientes.push(solicitud);
        }
    }

    return pendientes;
}

/**
 * Helpers para procesamiento de strings de archivos
 */
function isInformeFinal(doc) {
    if (!doc) return false;
    const name = String(doc).toLowerCase();
    return name.includes("informe") || name.includes("final");
}

function getDocUrl(doc) {
    if (!doc) return null;
    return typeof doc === "string" ? doc : (doc.url || doc.path || null);
}

/**
 * Obtiene el detalle completo para la vista de evaluación.
 * Implementa lógica de fallback si Solicitud.documentos está vacío.
 */
export async function obtenerDetallesPractica(id) {
    const solicitud = await solicitudRepo.findOne({
        where: { id: Number(id) },
        relations: ["estudiante"],
    });

    if (!solicitud) return null;

    const idEst = solicitud.estudiante?.id;
    const docs = Array.isArray(solicitud.documentos) ? solicitud.documentos : [];

    // Intento 1: Extraer de la Solicitud
    let informeDoc = docs.find(isInformeFinal);
    if (!informeDoc && docs.length > 0) informeDoc = docs[0];

    let informeFinal = getDocUrl(informeDoc);
    let bitacoras = docs.filter(d => d !== informeDoc).map(getDocUrl).filter(Boolean);

    // Fallback: Si faltan datos, buscar en tablas Informe/Bitacora
    if (idEst && (!informeFinal || bitacoras.length === 0)) {
        const [ultimoInforme, listaBitacoras] = await Promise.all([
            informeRepo.findOne({ 
                where: { estudiante: { id: idEst } }, 
                order: { id: "DESC" } 
            }),
            bitacoraRepo.find({ 
                where: { estudiante: { id: idEst } } 
            })
        ]);

        if (!informeFinal && ultimoInforme) {
            // Ajustado a tu entidad Informe (campo 'archivo')
            informeFinal = ultimoInforme.archivo || ultimoInforme.url;
        }

        if (bitacoras.length === 0 && listaBitacoras.length > 0) {
            // Ajustado a tu entidad Bitacora (campo 'archivo')
            bitacoras = listaBitacoras.map(b => b.archivo).filter(Boolean);
        }
    }

    return {
        estudiante: solicitud.estudiante,
        informeFinal,
        bitacoras,
        estado: solicitud.estado,
        fechaEnvio: solicitud.fechaEnvio,
        fechaLimiteEvaluacion: solicitud.fechaLimiteEvaluacion ?? null,
    };
}

/**
 * Califica y cierra la práctica. Nota Final = Nota Encargado.
 */
export async function calificarPractica(idSolicitud, notaEncargado, urlPauta = null, comentarios = null) {
    const solicitud = await solicitudRepo.findOne({
        where: { id: Number(idSolicitud) }
    });

    if (!solicitud) throw new Error("Práctica no encontrada.");

    // Validación de fecha
    const ahora = new Date();
    if (solicitud.fechaLimiteEvaluacion && ahora > new Date(solicitud.fechaLimiteEvaluacion)) {
        throw new Error("El plazo de evaluación ha vencido.");
    }

    const evaluacion = await evaluacionRepo.findOne({
        where: { solicitud: { id: solicitud.id } }
    });

    if (!evaluacion) {
        throw new Error("El supervisor aún no ha respondido su evaluación.");
    }

    const nEncargado = parseFloat(notaEncargado);
    if (isNaN(nEncargado) || nEncargado < 1 || nEncargado > 7) {
        throw new Error("La nota debe ser un número entre 1.0 y 7.0.");
    }

    // Actualización de evaluación
    evaluacion.notaEncargado = nEncargado;
    evaluacion.notaFinal = Number(nEncargado.toFixed(1));
    evaluacion.comentarios = comentarios || evaluacion.comentarios;
    evaluacion.fechaEvaluacion = ahora;
    if (urlPauta) evaluacion.urlPauta = urlPauta;

    await evaluacionRepo.save(evaluacion);

    // Cierre de solicitud
    solicitud.estado = "finalizada";
    await solicitudRepo.save(solicitud);

    return evaluacion;
}

export async function getHistorialEvaluaciones() {
    return await evaluacionRepo.find({
        where: { notaFinal: Not(IsNull()) },
        relations: ["solicitud", "solicitud.estudiante"],
    });
}