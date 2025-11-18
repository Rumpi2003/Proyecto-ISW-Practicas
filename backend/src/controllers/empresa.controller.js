import { EmpresaService } from "../services/empresa.service.js";
import { handleSuccess, handleErrorClient } from "../Handlers/responseHandlers.js";

const service = new EmpresaService();
const isInt = (value) => { return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10)); };

export const crearEmpresa = async (req, res) => {
    try {
        const data = req.body;
        const nuevaEmpresa = await service.crearEmpresa(data);
        handleSuccess(res, 201, "Empresa registrada con éxito", nuevaEmpresa);
    } catch (error) {
        if (error.message.includes("ya está registrado")) {
            return handleErrorClient(res, 409, error.message); 
        }
        handleErrorClient(res, 500, error.message);
    }
};

export const listarEmpresas = async (req, res) => {
    try {
        const empresas = await service.listarEmpresas();
        handleSuccess(res, 200, "Listado de empresas obtenido con éxito", empresas);
    } catch (error) {
        handleErrorClient(res, 500, "Error interno del servidor al obtener listado.", error.message);
    }
};

export const obtenerEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isInt(id)) return handleErrorClient(res, 400, "ID de empresa no válido.");

        const empresa = await service.obtenerEmpresaPorId(Number(id));
        handleSuccess(res, 200, "Empresa obtenida con éxito", empresa);
        
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        handleErrorClient(res, 500, "Error al obtener la empresa.", error.message);
    }
};

export const actualizarEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!isInt(id)) return handleErrorClient(res, 400, "ID de empresa no válido.");

        const empresaActualizada = await service.actualizarEmpresa(Number(id), data);
        handleSuccess(res, 200, "Empresa actualizada con éxito", empresaActualizada);

    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        if (error.message.includes("ya está registrado")) {
            return handleErrorClient(res, 409, error.message);
        }
        handleErrorClient(res, 500, "Error al actualizar la empresa.", error.message);
    }
};

export const eliminarEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isInt(id)) return handleErrorClient(res, 400, "ID de empresa no válido.");

        await service.eliminarEmpresa(Number(id));
        
        handleSuccess(res, 200, "Empresa eliminada correctamente", { id: Number(id) });
        
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        handleErrorClient(res, 500, "Error al eliminar la empresa.", error.message);
    }
};