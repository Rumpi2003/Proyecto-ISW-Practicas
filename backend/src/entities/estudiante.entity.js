import { EntitySchema } from "typeorm";

export const Estudiante = new EntitySchema({
  name: "Estudiante",
  tableName: "estudiantes",
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
      length: 12, // Ej: 12.345.678-9
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
    carrera: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    nivelPractica: {
      type: "varchar", // Puede ser "I", "II", o un número
      length: 50,
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