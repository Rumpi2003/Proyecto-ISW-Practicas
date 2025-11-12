import { EntitySchema } from "typeorm";

export const OfertaPractica = new EntitySchema({
    name: "OfertaPractica", 
    tableName: "ofertas_practica", 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        // Info de la oferta
        titulo: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        descripcion: {
            type: "text",
            nullable: false,
        },
        // Info de la empresa
        nombreEmpresa: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        contactoEmail: {
            type: "varchar",
            length: 150,
            nullable: false,
        },
        contactoTelefono: {
            type: "varchar",
            length: 10,
            nullable: true, 
        },
        // Requisitos 
        carrerasDestino: { 
            type: "text",
            nullable: false,
        }, 
        requisitosPrevios: {
            type: "text",
            nullable: false,
        },
        fechaLimitePostulacion: {
            type: "date",
            nullable: false,
        },
        // Estado de la oferta
        activa: {
            type: "boolean",
            default: true,
        },
        fechaPublicacion: {
            type: "timestamp",
            createDate: true, 
        },
    },
});