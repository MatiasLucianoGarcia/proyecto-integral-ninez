const Joi = require('joi');

// Crear
const createArticulacionSchema = Joi.object({
  id_ingreso: Joi.number().integer().required().messages({
    'any.required': 'El id_ingreso es obligatorio',
    'number.base': 'El id_ingreso debe ser un número',
  }),
  id_efector: Joi.number().integer().allow(null),
  observacion: Joi.string().allow('', null).max(500).messages({
    'string.max': 'La observación no puede superar los 500 caracteres',
  }),
  fecha_articulacion: Joi.date().required().messages({
    'any.required': 'La fecha de articulación es obligatoria',
    'date.base': 'Debe ser una fecha válida',
  }),
});

// Actualizar (PUT parcial)
const updateArticulacionSchema = Joi.object({
  id_ingreso: Joi.number().integer(),
  id_efector: Joi.number().integer().allow(null),
  observacion: Joi.string().allow('', null).max(500),
  fecha_articulacion: Joi.date(),
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar',
});

module.exports = { createArticulacionSchema, updateArticulacionSchema };
