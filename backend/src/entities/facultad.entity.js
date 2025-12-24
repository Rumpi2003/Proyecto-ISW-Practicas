import { EntitySchema } from "typeorm";

export const Facultad = new EntitySchema({
  name: "Facultad",
  tableName: "facultades",
  columns: {
    id: {
         primary: true,
          type: "int",
           generated: "increment" 
        },
    nombre: {
         type: "varchar",
          length: 100,
           unique: true,
            nullable: false 
        },
      color: { 
    type: "varchar", length: 7, nullable: true 
    },
  },
  relations: {
    carreras: {
      type: "one-to-many",
      target: "Carrera",
      inverseSide: "facultad",
    },
    encargados: {
      type: "one-to-many",
      target: "Encargado",
      inverseSide: "facultad",
    }
  }
});