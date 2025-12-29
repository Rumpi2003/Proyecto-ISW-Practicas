import Joi from 'joi';

/**
 * Validación para crear una nueva PautaEvaluacion
 */
export const createPautaEvaluacionSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 255 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),

    idCarrera: Joi.number(),
    nivelPractica: Joi.string()
    .valid("I", "II")
    .required(),

  aspectos_a_evaluar: Joi.array()
    .items(
      Joi.object({
        competencia: Joi.string()
          .trim()
          .max(255)
          .required()
          .messages({
            'string.base': 'La competencia debe ser un texto',
            'string.max': 'La competencia no puede exceder 255 caracteres',
            'any.required': 'Cada aspecto debe tener una competencia'
          }),

        descripcion: Joi.string()
          .trim()
          .max(1000)
          .required()
          .messages({
            'string.base': 'La descripción debe ser un texto',
            'string.max': 'La descripción no puede exceder 1000 caracteres',
            'any.required': 'Cada aspecto debe tener una descripción'
          }),

        actitudes: Joi.array()
          .items(
            Joi.string()
              .trim()
              .max(255)
              .messages({
                'string.base': 'Cada actitud debe ser un texto',
                'string.max': 'Una actitud no puede exceder 255 caracteres'
              })
          )
          .min(1)
          .required()
          .messages({
            'array.base': 'Las actitudes deben ser un arreglo',
            'array.min': 'Cada aspecto debe tener al menos una actitud',
            'any.required': 'Cada aspecto debe tener actitudes'
          })
      }).unknown(false)
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Los aspectos a evaluar deben ser un arreglo',
      'array.min': 'Debe haber al menos un aspecto a evaluar',
      'any.required': 'Los aspectos a evaluar son obligatorios'
    }),
}).unknown(false);

/**
 * Validación para actualizar una PautaEvaluacion
 * (todos los campos son opcionales)
 */
export const updatePautaEvaluacionSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 255 caracteres'
    }),

    idCarrera: Joi.number(),
    nivelPractica: Joi.string()
    .valid("I", "II")
    .required(),

  aspectos_a_evaluar: Joi.array()
    .items(
      Joi.object({
        competencia: Joi.string()
          .trim()
          .max(255)
          .required()
          .messages({
            'string.base': 'La competencia debe ser un texto',
            'string.max': 'La competencia no puede exceder 255 caracteres',
            'any.required': 'Cada aspecto debe tener una competencia'
          }),

        descripcion: Joi.string()
          .trim()
          .max(1000)
          .required()
          .messages({
            'string.base': 'La descripción debe ser un texto',
            'string.max': 'La descripción no puede exceder 1000 caracteres',
            'any.required': 'Cada aspecto debe tener una descripción'
          }),

        actitudes: Joi.array()
          .items(
            Joi.string()
              .trim()
              .max(255)
              .messages({
                'string.base': 'Cada actitud debe ser un texto',
                'string.max': 'Una actitud no puede exceder 255 caracteres'
              })
          )
          .min(1)
          .required()
          .messages({
            'array.base': 'Las actitudes deben ser un arreglo',
            'array.min': 'Cada aspecto debe tener al menos una actitud',
            'any.required': 'Cada aspecto debe tener actitudes'
          })
      }).unknown(false)
    )
    .min(1)
    .messages({
      'array.base': 'Los aspectos a evaluar deben ser un arreglo',
      'array.min': 'Debe haber al menos un aspecto a evaluar'
    }),
}).unknown(false);

/**
 * Función para validar datos de creación
 */
export function validateCreatePauta(data) {
  return createPautaEvaluacionSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });
}

/**
 * Función para validar datos de actualización
 */
export function validateUpdatePauta(data) {
  return updatePautaEvaluacionSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });
}
