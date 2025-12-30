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
    empresa: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    fechaCierre: {
      type: "timestamp", // Esta actúa como tu "fecha límite"
      nullable: false,   // Lo cambié a false porque debería ser obligatorio tener un límite
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "activa", // Por defecto nace activa
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    encargado: {
      target: "Encargado",
      type: "many-to-one",
      joinColumn: { name: "idEncargado" },
    },
    carreras: {
      target: "Carrera",
      type: "many-to-many",
      joinTable: true,
      cascade: true,
    },
  },
});