const Joi = require('joi');

const controlMedicoSchema = Joi.object({
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

  unidad_sanitaria: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'La unidad sanitaria debe ser texto',
      'string.empty': 'La unidad sanitaria es obligatoria',
      'string.min': 'La unidad sanitaria debe tener al menos 2 caracteres',
      'string.max': 'La unidad sanitaria no debe superar los 100 caracteres',
    }),

  observaciones: Joi.string()
    .max(255) // o más grande si querés
    .allow('', null) // acepta vacío o nulo
    .messages({
      'string.base': 'Las observaciones deben ser texto',
      'string.max': 'Las observaciones no deben superar los 255 caracteres',
    }),
});

module.exports = controlMedicoSchema;
