import { OfertasService } from "../services/ofertas.service.js"; 
import { handleSuccess, handleErrorClient } from "../Handlers/responseHandlers.js";
import { crearOfertaValidation } from "../validations/ofertas.validation.js";

const service = new OfertasService();

// Función para validar que el ID es válido
const isInt = (value) => {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
};

// src/controllers/ofertas.controller.js (Función crearOferta corregida y validada)

// ... Tus imports están correctos: OfertasService, handleSuccess, handleErrorClient, crearOfertaValidation

export const crearOferta = async (req, res) => {
    try {
        const data = req.body;
        
        // -------------------------------------------------------------
        // 1. VALIDACIÓN DEL CUERPO (REQ.BODY) - Requisito funcional clave
        const { error } = crearOfertaValidation.validate(req.body, { abortEarly: false }); 

        if (error) {
            // Si falla la validación, usa el handler de errores para HTTP 400 Bad Request
            const errorMessage = error.details.map(detail => detail.message).join('; ');
            return handleErrorClient(res, 400, "Error de validación en la solicitud.", errorMessage);
        }
        // -------------------------------------------------------------
        
        // Si la validación pasa, llama al servicio
        const nuevaOferta = await service.crearOferta(data);

        // 2. Respuesta de ÉXITO (201 Created) usando el Handler de tu compañero
        handleSuccess(res, 201, "Oferta de práctica publicada con éxito", nuevaOferta);

    } catch (error) {
        // 3. Respuesta de ERROR (500 Internal Server Error) usando el Handler de tu compañero
        console.error("Error en el controlador al crear la oferta:", error);
        // Usamos handleErrorClient (asumo que tu compañero usa este handler para el 500 también)
        handleErrorClient(res, 500, "Error interno del servidor al publicar la oferta.", error.message);
    }
};

// ... El resto de tu código (obtenerOferta, actualizarOferta, eliminarOferta) sigue siendo válido

export const obtenerOferta = async (req, res) => {
    try {
        const { id } = req.params; // Captura el ID 

        if (!isInt(id)) {
            return res.status(400).json({ 
                message: "ID de oferta no válido. Debe ser un número entero." 
            });
        }

        const oferta = await service.obtenerOfertaPorId(Number(id)); // Llama al servicio
        
        res.status(200).json(oferta);
        
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Error al obtener la oferta." });
    }
};

export const actualizarOferta = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isInt(id)) {
            return res.status(400).json({ 
                message: "ID de oferta no válido. Debe ser un número entero." 
            });
        }

        const data = req.body;
        
        const ofertaActualizada = await service.actualizarOferta(Number(id), data);
        
        res.status(200).json({
            message: "Oferta actualizada con éxito",
            data: ofertaActualizada,
        });

    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Error al actualizar la oferta." });
    }
};

export const eliminarOferta = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isInt(id)) {
            return res.status(400).json({ 
                message: "ID de oferta no válido. Debe ser un número entero." 
            });
        }

        await service.eliminarOferta(Number(id));
        
        res.status(204).send(); 
        
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Error al eliminar la oferta." });
    }
};