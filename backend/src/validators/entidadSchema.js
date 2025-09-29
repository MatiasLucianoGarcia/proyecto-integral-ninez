const Joi = require('joi');

const createEntidadSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto',
      'string.empty': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no debe superar los 100 caracteres',
      'any.required': 'El nombre es obligatorio',
    }),

  servicio_local: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'El campo servicio_local debe ser verdadero o falso',
      'any.required': 'El campo servicio_local es obligatorio',
    }),

  descripcion: Joi.string()
    .allow(null, '')
    .max(255)
    .messages({
      'string.base': 'La descripción debe ser una cadena de texto',
      'string.max': 'La descripción no debe superar los 255 caracteres',
    }),
});

const updateEntidadSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no debe superar los 100 caracteres',
    }),

  servicio_local: Joi.boolean().messages({
    'boolean.base': 'El campo servicio_local debe ser verdadero o falso',
  }),

  descripcion: Joi.string()
    .allow(null, '')
    .max(255)
    .messages({
      'string.base': 'La descripción debe ser una cadena de texto',
      'string.max': 'La descripción no debe superar los 255 caracteres',
    }),
});

module.exports = {
  createEntidadSchema,
  updateEntidadSchema,
};
