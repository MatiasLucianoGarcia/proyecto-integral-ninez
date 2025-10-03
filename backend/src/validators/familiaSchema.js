const Joi = require('joi');

const createFamiliaSchema = Joi.object({
  dni_p1: Joi.number()
    .integer()
    .min(10000000)
    .max(99999999)
    .required()
    .messages({
      'number.base': 'El DNI de la persona 1 debe ser un número',
      'number.min': 'El DNI de la persona 1 debe tener 8 dígitos',
      'number.max': 'El DNI de la persona 1 debe tener 8 dígitos',
      'any.required': 'El DNI de la persona 1 es obligatorio',
    }),
  dni_p2: Joi.number()
    .integer()
    .min(10000000)
    .max(99999999)
    .required()
    .invalid(Joi.ref('dni_p1'))
    .messages({
      'number.base': 'El DNI de la persona 2 debe ser un número',
      'number.min': 'El DNI de la persona 2 debe tener 8 dígitos',
      'number.max': 'El DNI de la persona 2 debe tener 8 dígitos',
      'any.required': 'El DNI de la persona 2 es obligatorio',
      'any.invalid': 'Los DNI no pueden ser iguales',
    }),
  id_parentezco: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El parentezco debe ser un número',
      'any.required': 'El parentezco es obligatorio',
    }),
  observaciones: Joi.string()
    .allow('', null)
    .max(255)
    .messages({
      'string.max': 'Las observaciones no pueden superar los 255 caracteres',
    }),
});

const updateFamiliaSchema = Joi.object({
  id_parentezco: Joi.number()
    .integer()
    .messages({
      'number.base': 'El parentezco debe ser un número',
    }),
  observaciones: Joi.string()
    .allow('', null)
    .max(255)
    .messages({
      'string.max': 'Las observaciones no pueden superar los 255 caracteres',
    }),
});

module.exports = {
  createFamiliaSchema,
  updateFamiliaSchema,
};