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
    nombre: {
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
});