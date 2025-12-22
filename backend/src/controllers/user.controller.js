// src/controllers/user.controller.js
import * as UserService from "../services/user.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

// ================= ESTUDIANTES =================
export async function createEstudianteCtrl(req, res) {
  try {
    const data = req.body;
    if (!data.email || !data.password || !data.nombre || !data.rut || !data.carrera || !data.nivelPractica) {
      return handleErrorClient(res, 400, "Faltan datos: email, password, nombre, rut, carrera, nivelPractica");
    }

    const newEstudiante = await UserService.createEstudiante(data);
    delete newEstudiante.password; //ocultar pass

    handleSuccess(res, 201, "Estudiante creado exitosamente", newEstudiante);
  } catch (error) {
    if (error.message.includes("ya existe")) return handleErrorClient(res, 409, error.message);
    handleErrorServer(res, 500, "Error al crear estudiante", error.message);
  }
}

export async function deleteEstudianteCtrl(req, res) {
  try {
    const { id } = req.params;
    await UserService.deleteEstudiante(id);
    handleSuccess(res, 200, "Estudiante eliminado correctamente");
  } catch (error) {
    handleErrorClient(res, 404, error.message);
  }
}

export async function getEstudiantesCtrl(req, res) {
  try {
    const estudiantes = await UserService.findAllEstudiantes();
    handleSuccess(res, 200, "Lista de estudiantes", estudiantes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// ================= ENCARGADOS =================
export async function createEncargadoCtrl(req, res) {
  try {
    const data = req.body;
    if (!data.email || !data.password || !data.nombre || !data.rut || !data.facultad) {
      return handleErrorClient(res, 400, "Faltan datos: email, password, nombre, rut, facultad");
    }

    const newEncargado = await UserService.createEncargado(data);
    delete newEncargado.password;

    handleSuccess(res, 201, "Encargado creado exitosamente", newEncargado);
  } catch (error) {
    if (error.message.includes("ya existe")) return handleErrorClient(res, 409, error.message);
    handleErrorServer(res, 500, "Error al crear encargado", error.message);
  }
}

export async function deleteEncargadoCtrl(req, res) {
  try {
    const { id } = req.params;
    await UserService.deleteEncargado(id);
    handleSuccess(res, 200, "Encargado eliminado correctamente");
  } catch (error) {
    handleErrorClient(res, 404, error.message);
  }
}

export async function getEncargadosCtrl(req, res) {
  try {
    const encargados = await UserService.findAllEncargados();
    handleSuccess(res, 200, "Lista de encargados", encargados);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// ================= SUPERVISORES =================
export async function createSupervisorCtrl(req, res) {
  try {
    const data = req.body;
    if (!data.email || !data.password || !data.nombre || !data.rut || !data.empresa) {
      return handleErrorClient(res, 400, "Faltan datos: email, password, nombre, rut, empresa");
    }

    const newSupervisor = await UserService.createSupervisor(data);
    delete newSupervisor.password;

    handleSuccess(res, 201, "Supervisor creado exitosamente", newSupervisor);
  } catch (error) {
    if (error.message.includes("ya existe")) return handleErrorClient(res, 409, error.message);
    handleErrorServer(res, 500, "Error al crear supervisor", error.message);
  }
}

export async function deleteSupervisorCtrl(req, res) {
  try {
    const { id } = req.params;
    await UserService.deleteSupervisor(id);
    handleSuccess(res, 200, "Supervisor eliminado correctamente");
  } catch (error) {
    handleErrorClient(res, 404, error.message);
  }
}

export async function getSupervisoresCtrl(req, res) {
  try {
    const supervisores = await UserService.findAllSupervisores();
    handleSuccess(res, 200, "Lista de supervisores", supervisores);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}