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
    nombre: {
       type: "varchar" 
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
    { type: "varchar" 

    },
  },
  relations: {
    facultad: {
      type: "many-to-one",
      target: "Facultad", // Nombre de la entidad Facultad
      joinColumn: { name: "facultadId" }, // Esto crea la columna de ID real en la DB
      nullable: false,
      eager: true, 
    },
  },
});