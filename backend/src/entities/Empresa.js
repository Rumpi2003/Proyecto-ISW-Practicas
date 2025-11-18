import { EntitySchema } from "typeorm";

export const Empresa = new EntitySchema({
    name: "Empresa",
    tableName: "empresas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        nombre: {
            type: "varchar",
            length: 100,
            unique: true, 
            nullable: false,
        },
        contactoEmail: {
            type: "varchar",
            length: 150,
            nullable: true,
        },
        contactoTelefono: {
            type: "varchar",
            length: 20,
            nullable: true,
        },
    },
    relations: {
        ofertas: {
            target: "Oferta",
            type: "one-to-many",
            inverseSide: "empresa",
        },
    },
});