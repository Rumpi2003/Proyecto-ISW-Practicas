import { EntitySchema } from "typeorm";

export const EvaluacionSupervisor = new EntitySchema({
    name: "EvaluacionSupervisor",
    tableName: "evaluaciones_supervisor",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        idPauta: {
            type: "int",
            nullable: false,
        },
        idEstudiante: {
            type: "int",
            nullable: false,
        },
        idSupervisor: {
            type: "int",
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 50,
            nullable: false, // "pendiente" cuando la crea el encargado y "completada" cuando el supervisor la llena
        },
        actividadesRealizadas: {
            type: "text",
            nullable: true,
        },
        respuestas: {
            type: "simple-json", // Almacena las respuestas del supervisor en formato JSON
            nullable: true,      // [{competencia: string, evaluacion: [string, ...]}, {...}]
        },                       // evaluacion puede ser A-Sobresaliente, B-Bueno, C-Moderado, D-Suficiente, E-Insuficiente, F-No aplica
        fortalezas: {
            type: "text",
            nullable: true,
        },
        debilidades: {
            type: "text",
            nullable: true,
        },
        observacionesGenerales: {
            type: "text",
            nullable: true,
        },
        fechaEvaluacion: {
            type: "timestamp",
            nullable: true,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
        },
    },
    relations: {
        pauta: {
            target: "PautaEvaluacion",
            type: "many-to-one",
            joinColumn: { name: "idPauta" },
            onDelete: "CASCADE",
        },
        estudiante: {
            target: "Estudiante",
            type: "many-to-one",
            joinColumn: { name: "idEstudiante" },
            onDelete: "CASCADE",
        },
        supervisor: {
            target: "Supervisor",
            type: "many-to-one",
            joinColumn: { name: "idSupervisor" },
            onDelete: "CASCADE",
        },
    },
});