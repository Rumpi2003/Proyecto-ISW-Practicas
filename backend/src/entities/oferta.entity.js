import { EntitySchema } from "typeorm";

export const Oferta = new EntitySchema({
  name: "Oferta",
  tableName: "ofertas",
  columns: {
    id: { primary: true, type: "int", generated: "increment" },
    titulo: { type: "varchar", length: 255, nullable: false },
    descripcion: { type: "text", nullable: false },
    carrerasDestinadas: { type: "varchar", array: true, nullable: false }, // Aquí guardamos el arreglo de carreras
    fechaCierre: { type: "timestamp", nullable: true },
    created_at: { type: "timestamp", createDate: true },
  },
  relations: {
    encargado: {
      target: "Encargado", // Quien publica la oferta
      type: "many-to-one",
      joinColumn: { name: "idEncargado" },
    },
    supervisor: {
      target: "Supervisor", // El supervisor que ofrece el cupo (y por ende su empresa)
      type: "many-to-one",
      joinColumn: { name: "idSupervisor" },
    }
  },
});