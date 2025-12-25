import { loginUser } from "../services/auth.service.js";
import { createEstudiante } from "../services/user.service.js"; 
import { handleSuccess, handleErrorClient } from "../handlers/responseHandlers.js";

// 1. LOGIN
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

// 2. REGISTER
export async function register(req, res) {
  try {
    // Recibimos los datos del Postman
    const userBody = req.body;

    // Llamamos al servicio para crear el usuario. 
    const newUser = await createEstudiante(userBody);

    handleSuccess(res, 201, "Usuario creado exitosamente", newUser);
  } catch (error) {
    handleErrorClient(res, 500, "Error al registrar usuario", error.message);
  }
}