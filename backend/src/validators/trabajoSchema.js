const Joi = require('joi');

const trabajoSchema = Joi.object({
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
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.base': 'La descripción debe ser texto',
      'string.empty': 'La descripción es obligatoria',
      'string.min': 'La descripción debe tener al menos 2 caracteres',
      'string.max': 'La descripción no debe superar los 200 caracteres',
    }),

  horario: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'El horario debe ser texto',
      'string.empty': 'El horario es obligatorio',
      'string.min': 'El horario debe tener al menos 2 caracteres',
      'string.max': 'El horario no debe superar los 100 caracteres',
    }),
});

module.exports = trabajoSchema;
