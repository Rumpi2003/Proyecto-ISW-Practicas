import { OfertasService } from "../services/ofertas.service.js"; 

const service = new OfertasService();

export const crearOferta = async (req, res) => {
    try {
        const data = req.body;
        
        const nuevaOferta = await service.crearOferta(data);

        res.status(201).json({
            message: "Oferta de práctica publicada con éxito",
            data: nuevaOferta,
        });

    } catch (error) {
        console.error("Error en el controlador al crear la oferta:", error);
        res.status(500).json({
            message: "Error al intentar publicar la oferta.",
            error: error.message,
        });
    }
};