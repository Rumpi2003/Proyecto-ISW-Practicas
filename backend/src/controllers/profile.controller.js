// src/controllers/profile.controller.js
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { updateUserProfile, deleteUserAccount } from "../services/user.service.js";

import { AppDataSource } from "../config/db.config.js"; 
import { Estudiante } from "../entities/estudiante.entity.js";
import { Encargado } from "../entities/encargado.entity.js";
import { Supervisor } from "../entities/supervisor.entity.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getPrivateProfile(req, res) {
  try {
    //ID y ROL del token
    const { id, rol } = req.user; 

    let usuarioEncontrado = null;
    let repo = null;

    if (rol === 'estudiante') {
        repo = AppDataSource.getRepository(Estudiante);
    } else if (rol === 'encargado') {
        repo = AppDataSource.getRepository(Encargado);
    } else if (rol === 'supervisor') {
        repo = AppDataSource.getRepository(Supervisor);
    }

    if (repo) {
        usuarioEncontrado = await repo.findOneBy({ id });
    }

    if (!usuarioEncontrado) {
        return handleErrorClient(res, 404, "Usuario no encontrado en la Base de Datos");
    }

    delete usuarioEncontrado.password;

    handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
      message: `¡Hola! Este es tu perfil privado.`,
      userData: usuarioEncontrado, 
    });

  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener perfil", error.message);
  }
}

//funcion patch
export async function updateProfile(req, res) {
  try {
    const { id, rol } = req.user; //obtenemos ID y ROL del token
    const { email, password } = req.body;

    //rol al servicio para que sepa tabla actualizar
    const updatedUser = await updateUserProfile(id, rol, { email, password });

    handleSuccess(res, 200, "Usuario actualizado correctamente", {
      id: updatedUser.id,
      email: updatedUser.email
    });

  } catch (error) {
    handleErrorClient(res, 400, error.message);
  }
}

export async function deleteProfile(req, res) {
  try {
    const { id, rol } = req.user; //obtenemos ID y ROL

    await deleteUserAccount(id, rol); //rol para saber en qué tabla borrar

    handleSuccess(res, 200, "Cuenta eliminada correctamente", {});

  } catch (error) {
    handleErrorClient(res, 400, error.message);
  }
}