const Joi = require('joi');

const createProgramaSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre debe ser texto',
      'string.empty': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede superar los 100 caracteres',
      'any.required': 'El nombre es obligatorio',
    }),
  descripcion: Joi.string()
    .allow(null, '')
    .max(500)
    .messages({
      'string.max': 'La descripción no puede superar los 500 caracteres',
    }),
});

const updateProgramaSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'El nombre debe ser texto',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede superar los 100 caracteres',
    }),
  descripcion: Joi.string()
    .allow(null, '')
    .max(500)
    .messages({
      'string.max': 'La descripción no puede superar los 500 caracteres',
    }),
});

module.exports = {
  createProgramaSchema,
  updateProgramaSchema,
};
