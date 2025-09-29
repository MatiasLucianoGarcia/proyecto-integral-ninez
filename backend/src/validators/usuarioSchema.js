const Joi = require('joi');

// Crear usuario (POST) → todos obligatorios
const createUsuarioSchema = Joi.object({
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

  contraseña: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'La contraseña debe ser una cadena de texto',
      'string.empty': 'La contraseña es obligatoria',
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es obligatoria',
    }),

  id_entidad: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El id_entidad debe ser un número',
      'any.required': 'El id_entidad es obligatorio',
    }),

  id_rol: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El id_rol debe ser un número',
      'any.required': 'El id_rol es obligatorio',
    }),
});

// Actualizar usuario (PUT) → todos opcionales
const updateUsuarioSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no debe superar los 100 caracteres',
    }),

  contraseña: Joi.string()
    .min(6)
    .messages({
      'string.base': 'La contraseña debe ser una cadena de texto',
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
    }),

  id_entidad: Joi.number()
    .integer()
    .messages({
      'number.base': 'El id_entidad debe ser un número',
    }),

  id_rol: Joi.number()
    .integer()
    .messages({
      'number.base': 'El id_rol debe ser un número',
    }),
});

module.exports = {
  createUsuarioSchema,
  updateUsuarioSchema,
};
