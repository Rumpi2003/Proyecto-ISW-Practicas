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
}