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
    carreraId: {
      type: "int",
      nullable: false,
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
    nivelPractica: {
      type: "varchar",
      length: 50, // Ej: "I", "II", "Práctica Profesional"
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
    carrera: {
      target: "Carrera",
      type: "many-to-one",
      joinColumn: { name: "carreraId" },
      nullable: false,
    },
  },
});