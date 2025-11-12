import { EntitySchema } from "typeorm";

export default new EntitySchema({
    name: "Evaluacion",
    tableName: "evaluaciones_dev",
    columns: {
        id: { type: Number, primary: true, generated: true },
        practica_id: { type: Number },

        // las guardas como string porque tu data venía así (ej: "6.5")
        nota_supervisor: { type: String, nullable: true },
        nota_encargado: { type: String, nullable: true },

        nota_final: { type: "float", nullable: true },
        estado: { type: String, default: "pendiente_encargado" },

        created_at: { type: Date, createDate: true },
        updated_at: { type: Date, updateDate: true },
    },
});
