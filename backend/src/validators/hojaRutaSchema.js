const Joi = require('joi');

// Crear hoja de ruta
const createHojaRutaSchema = Joi.object({
  id_servicio_local: Joi.number().integer().required().messages({
    'number.base': 'El ID del servicio local debe ser un número',
    'any.required': 'El ID del servicio local es obligatorio',
  }),
  fecha: Joi.date().required().messages({
    'date.base': 'La fecha debe ser una fecha válida',
    'any.required': 'La fecha es obligatoria',
  }),
  actividad: Joi.string().required().messages({
    'string.base': 'La actividad debe ser texto',
    'any.required': 'La actividad es obligatoria',
  }),
  resultado: Joi.string().allow('', null),
});

// Actualizar hoja de ruta (parcial)
const updateHojaRutaSchema = Joi.object({
  id_servicio_local: Joi.number().integer(),
  fecha: Joi.date(),
  actividad: Joi.string(),
  resultado: Joi.string().allow('', null),
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar',
});

module.exports = { createHojaRutaSchema, updateHojaRutaSchema };
