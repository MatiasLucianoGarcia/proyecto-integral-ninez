const Joi = require('joi');

const actividadSchema = Joi.object({
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

  actividad: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'La actividad debe ser texto',
      'string.empty': 'La actividad es obligatoria',
      'string.min': 'La actividad debe tener al menos 2 caracteres',
      'string.max': 'La actividad no debe superar los 100 caracteres',
    }),

  horario: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.base': 'El horario debe ser texto',
      'string.empty': 'El horario es obligatorio',
      'string.max': 'El horario no debe superar los 255 caracteres',
    }),

  observaciones: Joi.string()
    .allow('', null)
    .messages({
      'string.base': 'Las observaciones deben ser texto',
    }),

  fecha_real: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha real debe ser una fecha válida',
    }),
});

module.exports = actividadSchema;
