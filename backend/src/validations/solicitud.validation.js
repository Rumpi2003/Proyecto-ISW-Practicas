import Joi from 'joi';

export const createSolicitudSchema = Joi.object({
    mensaje: Joi.string().trim().min(1).max(2000).required().messages({
        'string.empty': 'El mensaje es requerido.',
        'any.required': 'El mensaje es requerido.',
        'string.max': 'El mensaje es demasiado largo (máximo 2000 caracteres).'
    })
}).unknown(true);

export const updateEstadoSolicitudSchema = Joi.object({
    estado: Joi.string().valid('aprobada', 'rechazada').required().messages({
        'any.required': 'El nuevo estado es requerido.',
        'any.only': 'El estado debe ser "aprobada" o "rechazada".'
    }),
    comentarios: Joi.string().trim().max(1000).allow(null, '').messages({
        'string.max': 'El comentario es demasiado largo (máximo 1000 caracteres).'
    })
}).unknown(true);

export const updateSolicitudEstudianteSchema = Joi.object({
    mensaje: Joi.string().trim().max(2000).allow(null, '').messages({
        'string.max': 'El mensaje es demasiado largo (máximo 2000 caracteres).'
    })
}).unknown(true);

export function validateCreateSolicitud(data) {
    return createSolicitudSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateUpdateEstadoSolicitud(data) {
    return updateEstadoSolicitudSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateUpdateSolicitudEstudiante(data) {
    return updateSolicitudEstudianteSchema.validate(data, { abortEarly: false, stripUnknown: true });
}