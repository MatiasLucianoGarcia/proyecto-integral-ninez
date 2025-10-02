const Joi = require('joi');

const viviendaSchema = Joi.object({
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

  tipo_vivienda: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El tipo de vivienda debe ser un número (ID)',
      'any.required': 'El tipo de vivienda es obligatorio',
    }),

  observaciones: Joi.string()
    .allow('')
    .max(500)
    .messages({
      'string.base': 'Las observaciones deben ser texto',
      'string.max': 'Las observaciones no deben superar los 500 caracteres',
    }),
});

module.exports = viviendaSchema;
