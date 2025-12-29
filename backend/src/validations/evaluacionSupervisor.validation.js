import Joi from 'joi';

const estadoValues = ['pendiente', 'completada'];
const notaValues = ['A', 'B', 'C', 'D', 'E', 'F', 'N/A'];

const respuestaSchema = Joi.object({
	competencia: Joi.string().trim().max(255).required().messages({
		'any.required': 'Cada respuesta debe incluir la competencia',
		'string.max': 'La competencia no puede exceder 255 caracteres'
	}),
	evaluacion: Joi.alternatives()
		.try(
			Joi.string().trim().valid(...notaValues),
			Joi.array().items(Joi.string().trim().valid(...notaValues)).min(1)
		)
		.required()
		.messages({
			'any.required': 'Cada respuesta debe incluir la evaluación',
			'string.valid': 'La evaluación debe ser una nota válida',
			'array.min': 'Debe incluir al menos una evaluación'
		})
}).unknown(false);

export const updateEvaluacionSupervisorSchema = Joi.object({
	idPauta: Joi.number().integer().positive(),
	idEstudiante: Joi.number().integer().positive(),
	idSupervisor: Joi.number().integer().positive(),
	estado: Joi.string().valid(...estadoValues),
	actividadesRealizadas: Joi.string().trim().min(50).max(1000).allow(null, '').messages({
        'string.min': 'actividadesRealizadas debe tener al menos 50 caracteres',
        'string.max': 'actividadesRealizadas no puede exceder 1000 caracteres'
    }),
	respuestas: Joi.array().items(respuestaSchema).min(1).allow(null),
	fortalezas: Joi.string().trim().min(50).max(1000).allow(null, '').messages({
        'string.min': 'fortalezas debe tener al menos 50 caracteres',
        'string.max': 'fortalezas no puede exceder 1000 caracteres'
    }),
	debilidades: Joi.string().trim().min(50).max(1000).allow(null, '').messages({
        'string.min': 'debilidades debe tener al menos 50 caracteres',
        'string.max': 'debilidades no puede exceder 1000 caracteres'
    }),
	observacionesGenerales: Joi.string().trim().min(50).max(1000).allow(null, '').messages({
        'string.min': 'observacionesGenerales debe tener al menos 50 caracteres',
        'string.max': 'observacionesGenerales no puede exceder 1000 caracteres'
    }),
	fechaEvaluacion: Joi.date().iso().allow(null)
}).unknown(false);

export function validateCreateEvaluacionSupervisor(data) {
	return createEvaluacionSupervisorSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateUpdateEvaluacionSupervisor(data) {
	return updateEvaluacionSupervisorSchema.validate(data, { abortEarly: false, stripUnknown: true });
}
