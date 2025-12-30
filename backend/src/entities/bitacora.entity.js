import { EntitySchema } from "typeorm";

export const Bitacora = new EntitySchema({
  name: "Bitacora",
  tableName: "bitacoras",
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
    archivos: {
      type: "text",
      array: true,
      nullable: true,
      default: "{}",
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
