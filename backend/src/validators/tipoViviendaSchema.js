const Joi = require('joi');

const createTipoViviendaSchema = Joi.object({
  tipo: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'El tipo de vivienda debe ser texto',
      'string.empty': 'El tipo de vivienda es obligatorio',
      'string.min': 'El tipo de vivienda debe tener al menos 3 caracteres',
      'string.max': 'El tipo de vivienda no debe superar los 50 caracteres',
      'any.required': 'El tipo de vivienda es obligatorio',
    }),
});

const updateTipoViviendaSchema = Joi.object({
  tipo: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.base': 'El tipo de vivienda debe ser texto',
      'string.min': 'El tipo de vivienda debe tener al menos 3 caracteres',
      'string.max': 'El tipo de vivienda no debe superar los 50 caracteres',
    }),
});

module.exports = {
  createTipoViviendaSchema,
  updateTipoViviendaSchema,
};
