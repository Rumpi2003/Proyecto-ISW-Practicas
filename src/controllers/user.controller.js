// src/controllers/user.controller.js
import { createUser, findUserByEmail } from "../services/user.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function adminCreateUser(req, res) {
  try {
    const data = req.body;

    // El admin debe proveer email, contraseña y rol
    if (!data.email || !data.password || !data.rol) {
      return handleErrorClient(res, 400, "Email, contraseña y rol son requeridos");
    }

    // rol valido
    if (!['estudiante', 'profesor', 'encargado'].includes(data.rol)) {
       return handleErrorClient(res, 400, "Rol no válido");
    }

    const newUser = await createUser(data); 
    delete newUser.password; 

    handleSuccess(res, 201, "Usuario creado exitosamente por el admin", newUser);

  } catch (error) {
    if (error.code === '23505') { // Error de email duplicado
      handleErrorClient(res, 409, "El email ya está registrado");
    } else {
      handleErrorServer(res, 500, "Error al crear usuario", error.message);
    }
  }
}

// futuras funciones para admin