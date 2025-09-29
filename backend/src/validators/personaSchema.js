const Joi = require('joi');

const createPersonaSchema = Joi.object({
  dni: Joi.number()
    .min(10000000)
    .max(99999999)
    .integer()
    .required()
    .messages({
        'number.base': 'El DNI debe ser un número',
        'number.min': 'El DNI debe tener 8 dígitos',
        'number.max': 'El DNI debe tener 8 dígitos',
        'any.required': 'El DNI es obligatorio',
    }),


  nombre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto',
      'string.empty': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no debe superar los 100 caracteres',
      'any.required': 'El nombre es obligatorio',
    }),

  apellido: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'El apellido debe ser una cadena de texto',
      'string.empty': 'El apellido es obligatorio',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no debe superar los 100 caracteres',
      'any.required': 'El apellido es obligatorio',
    }),

  fecha_nacimiento: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida',
      'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DD)',
      'any.required': 'La fecha de nacimiento es obligatoria',
    }),

  id_genero: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El id_genero debe ser un número',
      'any.required': 'El id_genero es obligatorio',
    }),

  id_nacionalidad: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El id_nacionalidad debe ser un número',
      'any.required': 'El id_nacionalidad es obligatorio',
    }),
});

const updatePersonaSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no debe superar los 100 caracteres',
    }),

  apellido: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.base': 'El apellido debe ser una cadena de texto',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no debe superar los 100 caracteres',
    }),

  fecha_nacimiento: Joi.date()
    .iso()
    .messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida',
      'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DD)',
    }),

  id_genero: Joi.number()
    .integer()
    .messages({
      'number.base': 'El id_genero debe ser un número',
    }),

  id_nacionalidad: Joi.number()
    .integer()
    .messages({
      'number.base': 'El id_nacionalidad debe ser un número',
    }),
});

module.exports = {
  createPersonaSchema,
  updatePersonaSchema,
};
