// src/controllers/auth.controller.js
import { loginUser } from "../services/auth.service.js";
// CORRECCIÓN 1: Importamos la función específica de estudiantes
import { createEstudiante } from "../services/user.service.js"; 
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function register(req, res) {
  try {
    const data = req.body;
    
    // validaciones basicas
    if (!data.email || !data.password || !data.nombre || !data.rut) {
      return handleErrorClient(res, 400, "Faltan datos obligatorios");
    }
    
    //valores por defecto si faltan (ej: nivelPractica)
    const dataEstudiante = {
      ...data,
      carrera: data.carrera || "Ingeniería Civil Informática", // O pedirlo obligatorio
      nivelPractica: data.nivelPractica || "I"
    };

    const newUser = await createEstudiante(dataEstudiante);
    delete newUser.password; 

    handleSuccess(res, 201, "Estudiante registrado exitosamente", newUser);
  } catch (error) {
    if (error.code === '23505' || error.message.includes("ya existe")) {
      handleErrorClient(res, 409, "El email o RUT ya está registrado");
    } else {
      handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}