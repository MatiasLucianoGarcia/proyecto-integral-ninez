const Joi = require('joi');

const createNacionalidadSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre de la nacionalidad debe ser una cadena de texto',
      'string.empty': 'El nombre de la nacionalidad es obligatorio',
      'string.min': 'El nombre de la nacionalidad debe tener al menos 3 caracteres',
      'string.max': 'El nombre de la nacionalidad no debe superar los 100 caracteres',
      'any.required': 'El nombre de la nacionalidad es obligatorio',
    }),
});

const updateNacionalidadSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'El nombre de la nacionalidad debe ser una cadena de texto',
      'string.min': 'El nombre de la nacionalidad debe tener al menos 3 caracteres',
      'string.max': 'El nombre de la nacionalidad no debe superar los 100 caracteres',
    }),
});

module.exports = {
  createNacionalidadSchema,
  updateNacionalidadSchema,
};
