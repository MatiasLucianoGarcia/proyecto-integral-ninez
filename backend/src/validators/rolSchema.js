const Joi = require('joi');

const createRolSchema = Joi.object({
  nombre_rol: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'El nombre del rol debe ser una cadena de texto',
      'string.empty': 'El nombre del rol es obligatorio',
      'string.min': 'El nombre del rol debe tener al menos 3 caracteres',
      'string.max': 'El nombre del rol no debe superar los 50 caracteres',
      'any.required': 'El nombre del rol es obligatorio',
    }),
});

const updateRolSchema = Joi.object({
  nombre_rol: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.base': 'El nombre del rol debe ser una cadena de texto',
      'string.min': 'El nombre del rol debe tener al menos 3 caracteres',
      'string.max': 'El nombre del rol no debe superar los 50 caracteres',
    }),
});

module.exports = {
  createRolSchema,
  updateRolSchema,
};
