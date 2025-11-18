import { EntitySchema } from "typeorm";

export const Carrera = new EntitySchema({
    name: "Carrera",
    tableName: "carreras",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        nombre: {
            type: "varchar",
            length: 80,
            unique: true,
            nullable: false,
        },
    },
    relations: {
        ofertas: {
            target: "Oferta",
            type: "many-to-many",
            inverseSide: "carreras",
        },
    },
});