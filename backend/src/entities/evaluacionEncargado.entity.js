import { EntitySchema } from "typeorm";

export const Evaluacion = new EntitySchema({
    name: "Evaluacion",
    tableName: "evaluaciones",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        notaEncargado: {
            type: "decimal",
            precision: 3,
            scale: 1,
            nullable: true,
        },
        notaSupervisor: {
            type: "decimal",
            precision: 3,
            scale: 1,
            nullable: true,
        },
        notaFinal: {
            type: "decimal",
            precision: 3,
            scale: 1,
            nullable: true, // Se calcula automáticamente al tener ambas notas
        },
        comentarios: {
            type: "text",
            nullable: true,
        },
        urlPauta: {
            type: "text",
            nullable: true,
        },
        fechaEvaluacion: {
            type: "timestamp",
            createDate: true,
        },
    },
    relations: {
        solicitud: {
            target: "Solicitud", 
            type: "one-to-one",
            joinColumn: true,
            onDelete: "CASCADE",
        },
    },
});