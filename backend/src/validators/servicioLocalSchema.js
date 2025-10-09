const Joi = require('joi');

// Esquema para crear (POST)
const createServicioLocalSchema = Joi.object({
  dni: Joi.number().integer().required().messages({
    'number.base': 'El DNI debe ser un número',
    'any.required': 'El DNI es obligatorio',
  }),
  id_equipo: Joi.number().integer().allow(null),
  fecha_ingreso: Joi.date().required().messages({
    'date.base': 'La fecha de ingreso debe ser una fecha válida',
    'any.required': 'La fecha de ingreso es obligatoria',
  }),
  motivo_ingreso: Joi.string().allow('', null).max(500).messages({
    'string.max': 'El motivo no puede superar los 500 caracteres',
  }),
  id_efector: Joi.number().integer().allow(null),
  id_derecho: Joi.number().integer().allow(null),
});

// Esquema para actualizar (PUT)
const updateServicioLocalSchema = Joi.object({
  dni: Joi.number().integer().messages({
    'number.base': 'El DNI debe ser un número',
  }),
  id_equipo: Joi.number().integer().allow(null),
  fecha_ingreso: Joi.date().messages({
    'date.base': 'La fecha de ingreso debe ser una fecha válida',
  }),
  motivo_ingreso: Joi.string().allow('', null).max(500).messages({
    'string.max': 'El motivo no puede superar los 500 caracteres',
  }),
  id_efector: Joi.number().integer().allow(null),
  id_derecho: Joi.number().integer().allow(null),
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar',
});

module.exports = { createServicioLocalSchema, updateServicioLocalSchema };
