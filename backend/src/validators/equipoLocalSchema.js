const Joi = require('joi');

const createEquipoLocalSchema = Joi.object({
  nombre: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.empty': 'El nombre no puede estar vacío',
      'string.max': 'El nombre no puede tener más de 100 caracteres',
      'any.required': 'El campo nombre es obligatorio',
    }),
});

const updateEquipoLocalSchema = Joi.object({
  nombre: Joi.string()
    .max(100)
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.max': 'El nombre no puede tener más de 100 caracteres',
    }),
});

module.exports = {
  createEquipoLocalSchema,
  updateEquipoLocalSchema,
};
