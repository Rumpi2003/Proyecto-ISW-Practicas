import { EntitySchema } from "typeorm";

export const Encargado = new EntitySchema({
  name: "Encargado",
  tableName: "encargados",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    facultadId: {
      type: "int",
      nullable: false
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false
    },
    rut: {
      type: "varchar",
      unique: true
    },
    email: {
      type: "varchar",
      unique: true
    },
    password:
    {
      type: "varchar"

    },
  },
  relations: {
    facultad: {
      type: "many-to-one",
      target: "Facultad", 
      joinColumn: { name: "facultadId" }, 
      nullable: false,
      eager: true,
    },
  },
});