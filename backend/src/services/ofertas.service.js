import { AppDataSource } from "../config/db.config.js";
import { Oferta } from "../entities/Oferta.js";
import { Empresa } from "../entities/Empresa.js"; 
import { Carrera } from "../entities/Carrera.js";
import { In } from "typeorm";

const repository = AppDataSource.getRepository(Oferta);
const empresaRepository = AppDataSource.getRepository(Empresa);
const carreraRepository = AppDataSource.getRepository(Carrera);

export class OfertasService {
    
    async crearOferta(data) {
        try {
            const { empresaId, carrerasIds, ...ofertaData } = data;

            // busca y valida la empresa
            const empresa = await empresaRepository.findOneBy({ id: empresaId });
            if (!empresa) {
                throw new Error(`Empresa con ID ${empresaId} no existe.`);
            }

            //busca y valida la carrera
            const carreras = await carreraRepository.findBy({ 
                id: In(carrerasIds) 
            });
            if (carreras.length !== carrerasIds.length) {
                throw new Error("Una o más carreras no fueron encontradas.");
            }

            // 3. Crea la oferta
            const nuevaOferta = repository.create({
                ...ofertaData,
                empresa: empresa, // Asigna la empresa
                carreras: carreras, // Asigna la carrera
            });

            const ofertaGuardada = await repository.save(nuevaOferta);
            return ofertaGuardada;

        } catch (error) {
            throw new Error(`Fallo al publicar la oferta de práctica: ${error.message}`);
        }
    }

    async obtenerOfertaPorId(id) {
        const oferta = await repository.findOneBy({ id });
        
        if (!oferta) {
            throw new Error(`Oferta con ID ${id} no encontrada.`);
        }
        return oferta;
    }

    async actualizarOferta(id, data) {
        //Verifica que la oferta exista
        const ofertaExistente = await this.obtenerOfertaPorId(id);

        // verifica que no se le asigne una empresa inexistente
        if (data.empresaId) {
            const empresa = await empresaRepository.findOneBy({ id: data.empresaId });
            if (!empresa) {
                throw new Error(`Empresa con ID ${data.empresaId} no existe.`);
            }
            data.empresa = empresa; // Asigna la Empresa
            delete data.empresaId; // Elimina el ID para no causar errores
        }
        
        // 3. Aplicar los cambios y guardar
        repository.merge(ofertaExistente, data);
        const ofertaActualizada = await repository.save(ofertaExistente);
        
        return ofertaActualizada;
    }

    async eliminarOferta(id) {
        // 1. Verificar si la oferta existe
        await this.obtenerOfertaPorId(id); 
        
        //Eliminar la oferta
        await repository.delete(id); 
    }
}