import { EntitySchema } from "typeorm";

export const Oferta = new EntitySchema({
  name: "Oferta", 
  tableName: "ofertas", 
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    titulo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion: {
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
    activa: {
      type: "boolean",
      default: true,
    },
    fechaPublicacion: {
      type: "timestamp",
      createDate: true, 
    },
  },
    relations: {
        empresa: {
            target: "Empresa",
            type: "many-to-one",
            joinColumn: true, 
            eager: true,      
            nullable: false,
        },
        carreras: {
            target: "Carrera",
            type: "many-to-many",
            joinTable: true, 
            eager: true,
        },
    },
});