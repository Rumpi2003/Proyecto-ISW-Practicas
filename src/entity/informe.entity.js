import { EntitySchema } from "typeorm";

export const Informe = new EntitySchema({
  name: "Informe",
  tableName: "informes",
  columns: {
    id: { primary: true, type: "int", generated: "increment" },
    titulo: { type: "varchar", length: 255, nullable: false },
    descripcion: { type: "varchar", length: 500, nullable: false },
    userId: { type: "int", nullable: false },
    createdAt: { type: "timestamp", createDate: true, default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", updateDate: true, default: () => "CURRENT_TIMESTAMP" }
  },
  relations: {
    user: { type: "many-to-one", target: "User", joinColumn: { name: "userId" } }
  }
});