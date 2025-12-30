import { EntitySchema } from "typeorm";

export const PautaEvaluacion = new EntitySchema({
  name: "PautaEvaluacion",
  tableName: "pautas_evaluacion",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idCarrera: {
      type: "int",
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    nivelPractica: {
      type: "varchar", // Puede ser "I", "II"
      length: 50,
      nullable: false,
    },
    aspectos_a_evaluar: {
      type: "simple-json", // Almacena un arreglo de aspectos en formato JSON: 
      nullable: false,     // [{competencia: string, descripcion: string, actitudes: [string, string, ...] }, {competencia: string...}]
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
      joinColumn: { name: "idCarrera" },
      nullable: false,
    },
  },
});