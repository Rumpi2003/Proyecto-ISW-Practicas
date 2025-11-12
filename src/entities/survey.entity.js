import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Survey",
  tableName: "surveys",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment"
    },

  title: {
    type: "varchar",
    length: 255
  },

  description: {
    type: "text",
    nullable: true
  },

  // questions se guardan como un arreglo de objetos JSON: [{id: 1, text: "¿Pregunta 1?", type: "text"}, ...]
  questions: {
    type: "simple-json"
  },

  created_at: {
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  }
}
});