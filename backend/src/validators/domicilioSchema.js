const Joi = require('joi');

const domicilioSchema = Joi.object({
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

  nombre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto',
      'string.empty': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no debe superar los 100 caracteres',
      'any.required': 'El nombre es obligatorio',
    }),

  numero: Joi.string()
    .min(1)
    .max(20)
    .required()
    .messages({
      'string.max': 'El número no debe superar los 20 caracteres',
      'any.required': 'El número es obligatorio',
    }),

  fecha_real: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha real debe ser una fecha válida',
    }),
});

module.exports = domicilioSchema;
