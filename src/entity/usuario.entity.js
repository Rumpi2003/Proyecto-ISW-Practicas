import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "usuarios",
  columns: {
    id: { primary: true, type: "int", generated: "increment" },
    email: { type: "varchar", length: 255, unique: true, nullable: false },
    password: { type: "varchar", length: 255, nullable: false },
    nombre: { type: "varchar", length: 255, nullable: true },
    createdAt: { type: "timestamp", createDate: true, default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", updateDate: true, default: () => "CURRENT_TIMESTAMP" }
  },
  relations: {
    bitacoras: { type: "one-to-many", target: "Bitacora", inverseSide: "user" },
    informes: { type: "one-to-many", target: "Informe", inverseSide: "user" }
  }
});