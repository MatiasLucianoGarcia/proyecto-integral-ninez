const Joi = require('joi');

const createGeneroSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'El nombre del género debe ser una cadena de texto',
      'string.empty': 'El nombre del género es obligatorio',
      'string.min': 'El nombre del género debe tener al menos 3 caracteres',
      'string.max': 'El nombre del género no debe superar los 50 caracteres',
      'any.required': 'El nombre del género es obligatorio',
    }),
});

const updateGeneroSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.base': 'El nombre del género debe ser una cadena de texto',
      'string.min': 'El nombre del género debe tener al menos 3 caracteres',
      'string.max': 'El nombre del género no debe superar los 50 caracteres',
    }),
});

module.exports = {
  createGeneroSchema,
  updateGeneroSchema,
};
