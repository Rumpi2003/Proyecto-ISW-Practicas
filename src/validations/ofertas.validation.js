import Joi from 'joi';

export const crearOfertaValidation = Joi.object({
    titulo: Joi.string().min(5).max(255).required().messages({
        'any.required': 'El título es obligatorio.',
    }),
    descripcion: Joi.string().min(10).required(),
    nombreEmpresa: Joi.string().max(100).required(),
    contactoEmail: Joi.string().email().required().messages({
        'string.email': 'El correo de contacto debe ser un email válido.',
    }),
    contactoTelefono: Joi.string().length(10).required().messages({
        'string.length': 'El teléfono debe tener 10 dígitos.',
    }),
    carrerasDestino: Joi.string().required().messages({ 
        'any.required': 'Debes especificar al menos una carrera de destino.',
    }),
    requisitosPrevios: Joi.string().required(),
    fechaLimitePostulacion: Joi.date().iso().min('now').required().messages({
        'date.iso': 'El formato de la fecha debe ser YYYY-MM-DD.',
        'date.min': 'La fecha límite de postulación debe ser una fecha futura.',
    }),
    activa: Joi.boolean().optional(),
});