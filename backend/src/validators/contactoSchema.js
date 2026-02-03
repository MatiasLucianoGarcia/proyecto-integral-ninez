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
      'string.max': 'El teléfono no debe superar los 50 caracteres',
      'any.required': 'El teléfono es obligatorio',
    }),

  fecha_real: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha real debe ser una fecha válida',
    }),
});

module.exports = contactoSchema;
