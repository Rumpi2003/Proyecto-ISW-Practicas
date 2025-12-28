import { EntitySchema } from "typeorm";

export const Encargado = new EntitySchema({
  name: "Encargado",
  tableName: "encargados",
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
    rut: {
      type: "varchar",
      length: 12,
      unique: true,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    facultad: {
      type: "varchar",
      length: 100,
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
});