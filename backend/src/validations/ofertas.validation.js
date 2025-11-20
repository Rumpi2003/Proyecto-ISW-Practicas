import Joi from 'joi';

// Para validar un objeto por el ID 
const idSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
}).required();

// Para la creacion de ofertas
export const crearOfertaValidation = Joi.object({
    
    // campos de la oferta
    titulo: Joi.string().min(5).max(255).required().messages({
        'any.required': 'El título es obligatorio.',
    }),
    descripcion: Joi.string().min(10).required(),
    requisitosPrevios: Joi.string().required(),
    fechaLimitePostulacion: Joi.date().iso().min('now').required().messages({
        'date.iso': 'El formato de la fecha debe ser YYYY-MM-DD.',
        'date.min': 'La fecha límite de postulación debe ser una fecha futura.',
    }),
    
    // Relaciones
    // Empresa 
    empresa: idSchema.messages({
        'any.required': 'El ID de la empresa es obligatorio.',
        'object.base': 'La empresa debe ser un objeto con el ID.'
    }),
    
    // Carreras
    carreras: Joi.array().items(idSchema).min(1).required().messages({
        'array.min': 'La oferta debe estar asociada al menos a una carrera.',
        'array.includesRequiredKnowns': 'Cada carrera debe ser un objeto con un ID válido.',
        'any.required': 'La selección de carreras es obligatoria.'
    }),

    // Campos por defecto
    activa: Joi.boolean().optional(),
    

    nombreEmpresa: Joi.forbidden(),
    contactoEmail: Joi.forbidden(),
    contactoTelefono: Joi.forbidden(),
    carrerasDestino: Joi.forbidden(), 

});