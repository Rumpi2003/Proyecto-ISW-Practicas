// src/entities/solicitud.entity.js
import { EntitySchema } from "typeorm";

export const Solicitud = new EntitySchema({
  name: "Solicitud",
  tableName: "solicitudes", // Nombre de la tabla en PostgreSQL
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idEstudiante: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    // texto dentro de la soli
    mensaje: {
      type: "text",
      nullable: false, //el estudiante debe escribir un mensaje
    },
    // archivo adjunto osea el documento
    documentos: {
      type: "text", 
      array: true,
      nullable: true,
      default: "{}", 
    },
    // estado de la solicitud una vez enviada
    estado: {
      type: "varchar",
      length: 50,
      default: "espera", // al enviar queda en 'espera', luego revisada pasa a 'rechazada' o 'aprobada'
    },
    //luego de la revision del encargado (post enviado)
    comentariosEncargado: {
      type: "text",
      nullable: true, 
    },
    fechaEnvio: {
      type: "timestamp",
      createDate: true, 
      default: () => "CURRENT_TIMESTAMP",
    },
    fechaRevision: {
      type: "timestamp",
      nullable: true,
    },
  },
});