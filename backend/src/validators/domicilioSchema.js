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
      'string.base': 'El número debe ser una cadena de texto',
      'string.empty': 'El número es obligatorio',
      'string.min': 'El número debe tener al menos 1 carácter',
      'string.max': 'El número no debe superar los 20 caracteres',
      'any.required': 'El número es obligatorio',
    }),

  fecha_carga: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'La fecha de carga debe ser una fecha válida',
      'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DD)',
      'any.required': 'La fecha de carga es obligatoria',
    }),
});

module.exports = domicilioSchema;
