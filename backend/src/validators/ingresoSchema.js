const Joi = require('joi');

const createIngresoSchema = Joi.object({
  dni: Joi.number().integer().required().messages({
    'number.base': 'El DNI debe ser un número',
    'any.required': 'El DNI es obligatorio',
  }),
  id_programa: Joi.number().integer().required().messages({
    'number.base': 'El ID del programa debe ser un número',
    'any.required': 'El ID del programa es obligatorio',
  }),
  id_efector: Joi.number().integer().allow(null),
  dni_familiar: Joi.number().integer().allow(null),
  fecha_ingreso: Joi.date().required().messages({
    'date.base': 'La fecha de ingreso debe ser una fecha válida',
    'any.required': 'La fecha de ingreso es obligatoria',
  }),
  observaciones: Joi.string().allow('', null).max(1000).messages({
    'string.max': 'Las observaciones no pueden superar los 1000 caracteres',
  }),
});

const updateIngresoSchema = Joi.object({
  dni: Joi.number().integer(),
  id_programa: Joi.number().integer(),
  id_efector: Joi.number().integer().allow(null),
  dni_familiar: Joi.number().integer().allow(null),
  fecha_ingreso: Joi.date(),
  observaciones: Joi.string().allow('', null).max(1000),
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar',
});

module.exports = { createIngresoSchema, updateIngresoSchema };
