const Joi = require('joi');

const escolaridadSchema = Joi.object({
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

  escuela: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'La escuela debe ser texto',
      'string.empty': 'La escuela es obligatoria',
      'string.min': 'La escuela debe tener al menos 2 caracteres',
      'string.max': 'La escuela no debe superar los 100 caracteres',
    }),

  nivel: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'El nivel debe ser texto',
      'string.empty': 'El nivel es obligatorio',
      'string.min': 'El nivel debe tener al menos 2 caracteres',
      'string.max': 'El nivel no debe superar los 50 caracteres',
    }),

  anio: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.base': 'El año debe ser texto',
      'string.empty': 'El año es obligatorio',
      'string.max': 'El año no debe superar los 50 caracteres',
    }),
});

module.exports = escolaridadSchema;
