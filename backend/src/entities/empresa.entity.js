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
      length: 255,
      nullable: false,
    },
    razonSocial: {
      type: "varchar",
      length: 255,
      nullable: true, // Opcional
    },
    direccion: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    web: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    // Una empresa puede tener muchas ofertas publicadas
    ofertas: {
      target: "Oferta",
      type: "one-to-many",
      inverseSide: "empresa",
    },
  },
});