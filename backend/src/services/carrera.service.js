import { AppDataSource } from "../config/db.config.js";
import { Carrera } from "../entities/Carrera.js"; 

const repository = AppDataSource.getRepository(Carrera);

const obtenerCarreraExistente = async (id) => {
    const carrera = await repository.findOneBy({ id });
    if (!carrera) {
        throw new Error(`Carrera con ID ${id} no encontrada.`);
    }
    return carrera;
};

export class CarreraService {
    
    async crearCarrera(data) {
        try {
            const nuevaCarrera = repository.create(data);
            await repository.save(nuevaCarrera);
            return nuevaCarrera;
        } catch (error) {
            if (error.code === '23505') { 
                throw new Error("El nombre de esta carrera ya existe.");
            }
            throw new Error('Fallo al crear la carrera.');
        }
    }

    async listarCarreras() {
        return await repository.find();
    }
    
    async obtenerCarreraPorId(id) {
        return await obtenerCarreraExistente(id);
    }

    async actualizarCarrera(id, data) {
        const carreraExistente = await obtenerCarreraExistente(id);

        repository.merge(carreraExistente, data);

        try {
            return await repository.save(carreraExistente);
        } catch (error) {
            if (error.code === '23505') { 
                throw new Error("El nuevo nombre de la carrera ya existe.");
            }
            throw new Error('Fallo al actualizar la carrera.');
        }
    }

    async eliminarCarrera(id) {
        await obtenerCarreraExistente(id); 
        
        await repository.delete(id); 
    }
}
