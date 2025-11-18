import { CarreraService } from "../services/carrera.service.js";
import { handleSuccess, handleErrorClient } from "../Handlers/responseHandlers.js";

const service = new CarreraService();
const isInt = (value) => { 
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
};

export const crearCarrera = async (req, res) => {
    try {
        const data = req.body;
        const nuevaCarrera = await service.crearCarrera(data);
        handleSuccess(res, 201, "Carrera registrada con éxito", nuevaCarrera);
    } catch (error) {
        if (error.message.includes("ya existe")) {
            return handleErrorClient(res, 409, error.message);
        }
        console.error("Error en el controlador al crear carrera:", error);
        handleErrorClient(res, 500, "Error interno del servidor", error.message);
    }
};

export const listarCarreras = async (req, res) => {
    try {
        const carreras = await service.listarCarreras();
        handleSuccess(res, 200, "Listado de carreras obtenido con éxito", carreras);
    } catch (error) {
        console.error("Error en el controlador al listar carreras:", error);
        handleErrorClient(res, 500, "Error interno del servidor", error.message);
    }
};

export const obtenerCarrera = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isInt(id)) {
            return handleErrorClient(res, 400, "ID de carrera no válido. Debe ser un número entero.");
        }

        const carrera = await service.obtenerCarreraPorId(Number(id));
        handleSuccess(res, 200, "Carrera obtenida con éxito", carrera);
        
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        handleErrorClient(res, 500, "Error al obtener la carrera.", error.message);
    }
};

export const actualizarCarrera = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!isInt(id)) {
            return handleErrorClient(res, 400, "ID de carrera no válido. Debe ser un número entero.");
        }

        const carreraActualizada = await service.actualizarCarrera(Number(id), data);
        
        handleSuccess(res, 200, "Carrera actualizada con éxito", carreraActualizada);

    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        if (error.message.includes("ya existe")) {
            return handleErrorClient(res, 409, error.message); 
        }
        handleErrorClient(res, 500, "Error al actualizar la carrera.", error.message);
    }
};

export const eliminarCarrera = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isInt(id)) {
            return handleErrorClient(res, 400, "ID de carrera no válido. Debe ser un número entero.");
        }

        await service.eliminarCarrera(Number(id));
        
        handleSuccess(res, 200, "Carrera eliminada correctamente", { id: Number(id) });
        
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        handleErrorClient(res, 500, "Error al eliminar la carrera.", error.message);
    }
};