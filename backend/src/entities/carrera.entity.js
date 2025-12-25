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
      length: 100,
      unique: true,
      nullable: false,
    },
    // 👇 Nueva columna para las siglas (Ej: ICI, ARQ, ICO)
    abreviacion: {
      type: "varchar",
      length: 50,
      nullable: true, // Lo dejamos opcional para evitar conflictos con datos existentes
    },
  },
  relations: {
    facultad: {
      type: "many-to-one",
      target: "Facultad",
      joinColumn: { name: "facultadId" },
      nullable: false,
      inverseSide: "carreras",
    },
  },
});