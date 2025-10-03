const Joi = require('joi');

const createParentezcoSchema = Joi.object({
  descripcion: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'La descripción debe ser una cadena de texto',
      'string.empty': 'La descripción es obligatoria',
      'string.min': 'La descripción debe tener al menos 3 caracteres',
      'string.max': 'La descripción no debe superar los 50 caracteres',
      'any.required': 'La descripción es obligatoria',
    }),
});

const updateParentezcoSchema = Joi.object({
  descripcion: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.base': 'La descripción debe ser una cadena de texto',
      'string.min': 'La descripción debe tener al menos 3 caracteres',
      'string.max': 'La descripción no debe superar los 50 caracteres',
    }),
});

module.exports = {
  createParentezcoSchema,
  updateParentezcoSchema,
};
