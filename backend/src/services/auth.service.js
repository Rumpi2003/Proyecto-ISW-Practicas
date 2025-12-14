// src/services/auth.service.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/db.config.js";
import { Estudiante } from "../entities/estudiante.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { Supervisor } from "../entities/supervisor.entity.js";

// Repositorios
const estudianteRepo = AppDataSource.getRepository(Estudiante);
const encargadoRepo = AppDataSource.getRepository(Encargado);
const supervisorRepo = AppDataSource.getRepository(Supervisor);

export async function loginUser(email, password) {
  let user = null;
  let rol = "";

  //buscar en estudiantes
  user = await estudianteRepo.findOneBy({ email });
  if (user) {
    rol = "estudiante";
  } else {
    //buscar en encargados
    user = await encargadoRepo.findOneBy({ email });
    if (user) {
      rol = "encargado";
    } else {
      //buscar en supervisores
      user = await supervisorRepo.findOneBy({ email });
      if (user) {
        rol = "supervisor";
      }
    }
  }

  //si no encontro
  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  //verificar contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Credenciales incorrectas");
  }

  //crear payload con el ID y el ROL
  //rol al token aunque no este en la BD
  const payload = { 
    id: user.id, 
    email: user.email, 
    rol: rol 
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  //limpiar contraseña antes de enviar
  const userResponse = { ...user };
  delete userResponse.password;

  return { user: userResponse, token, rol };
}