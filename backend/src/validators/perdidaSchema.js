const Joi = require('joi');

const perdidaSchema = Joi.object({
  dni: Joi.number()
    .integer()
    .min(10000000)
    .max(99999999)
    .required()
    .messages({
      'number.base': 'El DNI debe ser un número',
      'number.integer': 'El DNI debe ser un número entero',
      'number.min': 'El DNI debe tener 8 dígitos',
      'number.max': 'El DNI debe tener 8 dígitos',
      'any.required': 'El DNI es obligatorio',
    }),

  descripcion: Joi.string()
    .min(5)
    .required()
    .messages({
      'string.base': 'La descripción debe ser texto',
      'string.empty': 'La descripción es obligatoria',
      'string.min': 'La descripción debe tener al menos 5 caracteres',
    }),

  fecha_real: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha real debe ser una fecha válida',
    }),
});

module.exports = perdidaSchema;
