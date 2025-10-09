const Joi = require('joi');

const createDerechoVulneradoSchema = Joi.object({
  descripcion: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.base': 'La descripción debe ser un texto',
      'string.empty': 'La descripción no puede estar vacía',
      'string.max': 'La descripción no puede tener más de 255 caracteres',
      'any.required': 'El campo descripción es obligatorio',
    }),
});

const updateDerechoVulneradoSchema = Joi.object({
  descripcion: Joi.string()
    .max(255)
    .messages({
      'string.base': 'La descripción debe ser un texto',
      'string.max': 'La descripción no puede tener más de 255 caracteres',
    }),
});

module.exports = {
  createDerechoVulneradoSchema,
  updateDerechoVulneradoSchema,
};
