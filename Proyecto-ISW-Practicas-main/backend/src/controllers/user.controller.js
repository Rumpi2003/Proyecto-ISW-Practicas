import * as UserService from "../services/user.service.js";
import { 
    handleSuccess, 
    handleErrorClient, 
    handleErrorServer 
} from "../handlers/responseHandlers.js"; 

// === OBTENER TODOS LOS USUARIOS (TABLA PRINCIPAL) ===
export async function getUsers(req, res) {
    try {
        const encargados = await UserService.findAllEncargados();
        const estudiantes = await UserService.findAllEstudiantes();
        const supervisores = await UserService.findAllSupervisores();

        const allUsers = [
            ...encargados.map(u => ({ ...u, rol: 'encargado' })),
            ...estudiantes.map(u => ({ ...u, rol: 'estudiante' })),
            ...supervisores.map(u => ({ ...u, rol: 'supervisor' }))
        ];

        handleSuccess(res, 200, "Lista de usuarios", allUsers);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener la lista de usuarios", error.message);
    }
}

// === GESTIÓN DE ESTUDIANTES ===
export async function createEstudianteCtrl(req, res) {
    try {
        const data = req.body;
        const newEstudiante = await UserService.createEstudiante(data);
        handleSuccess(res, 201, "Estudiante creado exitosamente", newEstudiante);
    } catch (error) {
        handleErrorServer(res, 500, "Error al crear estudiante", error.message);
    }
}

export async function getEstudiantesCtrl(req, res) {
    try {
        const estudiantes = await UserService.findAllEstudiantes();
        handleSuccess(res, 200, "Lista de estudiantes", estudiantes);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener estudiantes", error.message);
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

// === GESTIÓN DE ENCARGADOS ===
export async function getEncargadosCtrl(req, res) {
    try {
        const encargados = await UserService.findAllEncargados();
        handleSuccess(res, 200, "Lista de encargados", encargados);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener encargados", error.message);
    }
}

export async function createEncargadoCtrl(req, res) {
    try {
        const data = req.body;
        const newEncargado = await UserService.createEncargado(data);
        handleSuccess(res, 201, "Encargado creado exitosamente", newEncargado);
    } catch (error) {
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

// === GESTIÓN DE SUPERVISORES ===
export async function getSupervisoresCtrl(req, res) {
    try {
        const supervisores = await UserService.findAllSupervisores();
        handleSuccess(res, 200, "Lista de supervisores", supervisores);
    } catch (error) {
        handleErrorServer(res, 500, "Error al obtener supervisores", error.message);
    }
}

export async function createSupervisorCtrl(req, res) {
    try {
        const data = req.body;
        const newSupervisor = await UserService.createSupervisor(data);
        handleSuccess(res, 201, "Supervisor creado exitosamente", newSupervisor);
    } catch (error) {
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

// === FUNCIÓN GENÉRICA PARA EL FRONTEND (Users.jsx) ===
export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        await UserService.deleteUser(id); 
        handleSuccess(res, 200, "Usuario eliminado correctamente");
    } catch (error) {
        handleErrorClient(res, 404, "No se pudo eliminar el usuario");
    }
}