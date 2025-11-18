import { AppDataSource } from "../config/db.config.js";
import { Empresa } from "../entities/Empresa.js";

const repository = AppDataSource.getRepository(Empresa);
const obtenerEmpresaExistente = async (id) => {
    const empresa = await repository.findOneBy({ id });
    if (!empresa) {
        // Este mensaje es capturado por el controlador para devolver un 404
        throw new Error(`Empresa con ID ${id} no encontrada.`);
    }
    return empresa;
};


export class EmpresaService {
    
async crearEmpresa(data) {
        try {
            const nuevaEmpresa = repository.create(data);
            await repository.save(nuevaEmpresa);
            return nuevaEmpresa;
        } catch (error) {
            if (error.code === '23505') { // nombre repetido 
                throw new Error("El nombre de esta empresa ya está registrado.");
            }
            throw new Error('Fallo al crear la empresa.');
        }
    }

async obtenerEmpresaPorId(id) {
        return await obtenerEmpresaExistente(id);
    }

    async listarEmpresas() {
        return await repository.find();
    }

    async actualizarEmpresa(id, data) {
        const empresaExistente = await obtenerEmpresaExistente(id);
        
        // Aplica los cambios a la entidad existente (ideal para PATCH)
        repository.merge(empresaExistente, data);

        try {
            // Guarda los cambios en la DB
            return await repository.save(empresaExistente);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error("El nuevo nombre de la empresa ya está registrado.");
            }
            throw new Error('Fallo al actualizar la empresa.');
        }
    }

    async eliminarEmpresa(id) {
        await obtenerEmpresaExistente(id); 
        
        await repository.delete(id); 
    }

}