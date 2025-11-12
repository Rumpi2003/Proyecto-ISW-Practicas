//import { handleSuccess } from "../Handlers/responseHandlers.js";
import { handleSuccess, handleErrorClient } from "../handlers/responseHandlers.js";
import { updateUserProfile, deleteUserAccount } from "../services/user.service.js"; 


export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

//funcion patch
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;             // id desde el token JWT
    const { email, password } = req.body;   // actualizar

    const updatedUser = await updateUserProfile(userId, { email, password });

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
    const userId = req.user.id;             // Id del token

    await deleteUserAccount(userId);        // funcion eliminar

    handleSuccess(res, 200, "Cuenta eliminada correctamente", {});

  } catch (error) {
    handleErrorClient(res, 400, error.message);
  }
}