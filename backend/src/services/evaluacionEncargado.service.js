import { AppDataSource } from "../config/db.config.js";
import { Solicitud } from "../entities/solicitud.entity.js";
import { Evaluacion } from "../entities/evaluacionEncargado.entity.js";
import { Bitacora } from "../entities/bitacora.entity.js";
import { Informe } from "../entities/informe.entity.js";
import { EvaluacionSupervisor } from "../entities/evaluacionSupervisor.entity.js";
import { Not, IsNull } from "typeorm";

const solicitudRepo = AppDataSource.getRepository(Solicitud);
const evaluacionRepo = AppDataSource.getRepository(Evaluacion);
const bitacoraRepo = AppDataSource.getRepository(Bitacora);
const informeRepo = AppDataSource.getRepository(Informe);
const evaluacionSupervisorRepo = AppDataSource.getRepository(EvaluacionSupervisor);

// Helper: Transforma el formulario del supervisor en nota numérica
function calcularNotaSupervisor(respuestas) {
    if (!respuestas || !Array.isArray(respuestas)) return 1.0;
    const equivalencias = {
        "A-Sobresaliente": 7.0, "B-Bueno": 6.0, "C-Moderado": 5.0,
        "D-Suficiente": 4.0, "E-Insuficiente": 2.0, "F-No aplica": null
    };
    let suma = 0, cont = 0;
    respuestas.forEach(grupo => {
        grupo.evaluacion?.forEach(opcion => {
            const valor = equivalencias[opcion];
            if (valor !== null && valor !== undefined) { suma += valor; cont++; }
        });
    });
    return cont > 0 ? Number((suma / cont).toFixed(1)) : 1.0;
}

/**
 * Obtiene las prácticas donde el supervisor ya completó su formulario.
 */
export async function obtenerPendientes() {
    const solicitudes = await solicitudRepo.find({ relations: ["estudiante"] });
    const pendientes = [];
    for (const solicitud of solicitudes) {
        const idEst = solicitud.estudiante?.id;
        const evalSup = await evaluacionSupervisorRepo.findOne({
            where: { idEstudiante: idEst, estado: "completada" }
        });
        const evalEnc = await evaluacionRepo.findOne({ where: { solicitud: { id: solicitud.id } } });
        if (evalSup && (!evalEnc || evalEnc.notaEncargado == null)) {
            pendientes.push(solicitud);
        }
    }
    return pendientes;
}

/**
 * ESTA ES LA FUNCIÓN QUE FALTABA:
 * Recupera bitácoras e informe para que el encargado pueda revisar antes de calificar.
 */
export async function obtenerDetallesPractica(id) {
    const solicitud = await solicitudRepo.findOne({ 
        where: { id: Number(id) }, 
        relations: ["estudiante"] 
    });

    if (!solicitud) return null;

    const idEst = solicitud.estudiante?.id;
    const docs = solicitud.documentos || [];
    
    // Identificar informe y bitácoras
    let informeFinal = docs.find(d => String(d).toLowerCase().includes("informe")) || null;
    let bitacoras = docs.filter(d => d !== informeFinal);

    // Fallback: si no están en la solicitud, buscar en sus tablas
    if (idEst && (!informeFinal || bitacoras.length === 0)) {
        const [uInf, lBit] = await Promise.all([
            informeRepo.findOne({ where: { estudiante: { id: idEst } }, order: { id: "DESC" } }),
            bitacoraRepo.find({ where: { estudiante: { id: idEst } } })
        ]);
        if (!informeFinal && uInf) informeFinal = uInf.archivo;
        if (bitacoras.length === 0) {
            bitacoras = lBit.flatMap(b => b.archivos || [b.archivo]).filter(Boolean);
        }
    }

    // Nota del supervisor para referencia del encargado
    const evalSup = await evaluacionSupervisorRepo.findOne({
        where: { idEstudiante: idEst, estado: "completada" }
    });

    return { 
        ...solicitud, 
        informeFinal, 
        bitacoras,
        notaSupervisor: evalSup ? calcularNotaSupervisor(evalSup.respuestas) : null 
    };
}

/**
 * Registra la nota, calcula promedio y finaliza la solicitud.
 */
export async function calificarPractica(idSolicitud, notaEncargado, urlPauta = null, comentarios = null) {
    const solicitud = await solicitudRepo.findOne({
        where: { id: Number(idSolicitud) },
        relations: ["estudiante"]
    });
    if (!solicitud) throw new Error("Práctica no encontrada.");

    const evalSup = await evaluacionSupervisorRepo.findOne({
        where: { idEstudiante: solicitud.estudiante.id, estado: "completada" }
    });
    if (!evalSup) throw new Error("El supervisor aún no ha evaluado.");

    const notaSup = calcularNotaSupervisor(evalSup.respuestas);
    const nEncargado = parseFloat(notaEncargado);

    let evaluacion = await evaluacionRepo.findOne({ where: { solicitud: { id: solicitud.id } } })
        || evaluacionRepo.create({ solicitud });

    evaluacion.notaEncargado = nEncargado;
    evaluacion.notaSupervisor = notaSup;
    evaluacion.notaFinal = Number(((nEncargado + notaSup) / 2).toFixed(1));
    evaluacion.comentarios = comentarios;
    evaluacion.urlPauta = urlPauta;
    evaluacion.fechaEvaluacion = new Date();

    await evaluacionRepo.save(evaluacion);
    
    solicitud.estado = "finalizada";
    await solicitudRepo.save(solicitud);

    return evaluacion;
}

export async function obtenerEvaluacionPorEstudiante(idEstudiante) {
    return await evaluacionRepo.findOne({
        where: { solicitud: { estudiante: { id: idEstudiante } } },
        relations: ["solicitud", "solicitud.estudiante"],
        order: { fechaEvaluacion: "DESC" }
    });
}

export async function getHistorialEvaluaciones() {
    return await evaluacionRepo.find({
        where: { notaFinal: Not(IsNull()) },
        relations: ["solicitud", "solicitud.estudiante"],
        order: { fechaEvaluacion: "DESC" }
    });
}