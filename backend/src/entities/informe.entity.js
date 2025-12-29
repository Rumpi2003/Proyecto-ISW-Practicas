import { EntitySchema } from "typeorm";

export const Informe = new EntitySchema({
  name: "Informe",
  tableName: "informes",
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
    descripcion: {
      type: "text",
      nullable: false,
    },
    archivo: {
      type: "text",
      nullable: true,
    },
    fechaSubida: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "pendiente",
    },
    comentariosEncargado: {
      type: "text",
      nullable: true,
    },
    fechaRevision: {
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
  },
});
