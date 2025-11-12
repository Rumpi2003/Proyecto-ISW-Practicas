import * as authService from "../services/auth.service.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }

    const data = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      data: data
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
}

export async function register(req, res) {
  try {
    const { email, password, nombre } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }

    const user = await authService.registerUser(email, password, nombre);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}