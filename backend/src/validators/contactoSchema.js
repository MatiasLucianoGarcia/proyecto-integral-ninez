const Joi = require('joi');

const contactoSchema = Joi.object({
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

  telefono: Joi.string()
    .pattern(/^\d{11,15}$/)
    .required()
    .messages({
      'string.base': 'El teléfono debe ser una cadena de texto',
      'string.pattern.base': 'El teléfono debe ser numérico y tener entre 11 y 15 dígitos',
      'string.empty': 'El teléfono es obligatorio',
    }),
});

module.exports = contactoSchema;
