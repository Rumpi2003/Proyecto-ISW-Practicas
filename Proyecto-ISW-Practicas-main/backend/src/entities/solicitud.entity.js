import { EntitySchema } from "typeorm";

export const Solicitud = new EntitySchema({
  name: "Solicitud",
  tableName: "solicitudes",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idEstudiante: {
      type: "int",
      nullable: false,
    },
    mensaje: {
      type: "text",
      nullable: false,
    },
    // Archivos adjuntos (documentos)
    documentos: {
      type: "text",
      array: true,
      nullable: true,
    },
    urlInformeFinal: {
      type: "text",
      nullable: true,
    },
    urlsBitacoras: {
      type: "text",
      array: true,
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "espera",
    },
    fechaEnvio: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    fechaRevision: {
      type: "timestamp",
      nullable: true,
    },
    fechaLimiteEvaluacion: {
      type: "timestamp",
      nullable: true,
    },
  },
  relations: {
    estudiante: {
      target: "Estudiante",
      type: "many-to-one",
      joinColumn: { name: "idEstudiante" },
      onDelete: "CASCADE",
    },
    evaluacion: {
      target: "Evaluacion",
      type: "one-to-one",
      inverseSide: "solicitud",
      cascade: true,
    },
  },
});