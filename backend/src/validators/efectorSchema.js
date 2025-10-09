const Joi = require('joi');

const createEfectorSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'string.empty': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no debe superar los 100 caracteres',
      'any.required': 'El nombre es obligatorio',
    }),
  area: Joi.string().max(100).allow(null, '').messages({
    'string.max': 'El área no debe superar los 100 caracteres',
  }),
});

const updateEfectorSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no debe superar los 100 caracteres',
  }),
  area: Joi.string().max(100).allow(null, '').messages({
    'string.max': 'El área no debe superar los 100 caracteres',
  }),
});

module.exports = {
  createEfectorSchema,
  updateEfectorSchema,
};
