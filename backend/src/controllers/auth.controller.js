// src/controllers/auth.controller.js
import { loginUser } from "../services/auth.service.js";
import { createEstudiante } from "../services/user.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return handleErrorClient(res, 400, "Email y contraseña son requeridos");
    }
    
    const data = await loginUser(email, password);
    handleSuccess(res, 200, "Login exitoso", data);
  } catch (error) {
    handleErrorClient(res, 401, error.message);
  }
}
