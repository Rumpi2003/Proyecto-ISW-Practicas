import { AppDataSource } from "../config/db.config.js";
import { OfertaPractica } from "../entities/OfertaPractica.js"; 

const repository = AppDataSource.getRepository(OfertaPractica);

export class OfertasService {


    async crearOferta(data) {
        try {
            //crea una instancia de la entidad
            const nuevaOferta = repository.create(data);

            // Inserta el dato
            const ofertaGuardada = await repository.save(nuevaOferta);

            console.log(`Oferta ID ${ofertaGuardada.id} publicada exitosamente.`);
            return ofertaGuardada;

        } catch (error) {
            console.error("Error en el servicio al guardar la oferta:", error);
            // error generico
            throw new Error('Fallo al publicar la oferta de práctica.');
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
        //Verificar si la oferta existe
        const ofertaExistente = await this.obtenerOfertaPorId(id);

        //Aplicar los cambios
        repository.merge(ofertaExistente, data);

        // Guardar la entidad 
        const ofertaActualizada = await repository.save(ofertaExistente);
        return ofertaActualizada;
    }

    async eliminarOferta(id) {
        // Verificar si la oferta existe 
        await this.obtenerOfertaPorId(id); 

        // Eliminar la oferta
        await repository.delete(id);
    }

     //Obtiene una lista de todas las ofertas 
    async listarOfertas() {
        try {
            const ofertas = await repository.find(); 
            return ofertas;
        } catch (error) {
            console.error("Error en el servicio al listar ofertas:", error);
            throw new Error('Fallo al listar las ofertas de práctica.');
        }
    }
}



