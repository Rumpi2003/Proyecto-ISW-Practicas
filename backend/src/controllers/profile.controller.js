// src/controllers/profile.controller.js
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { updateUserProfile, deleteUserAccount } from "../services/user.service.js"; 

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