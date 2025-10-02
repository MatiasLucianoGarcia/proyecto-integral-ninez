const Joi = require('joi');

const updateSaludSchema = Joi.object({
  nombre: Joi.string().allow(null, '').messages({
    'string.base': 'El nombre debe ser texto',
  }),
  enfermedad_cronica: Joi.string().allow(null, '').messages({
    'string.base': 'La enfermedad crónica debe ser texto',
  }),
  tratamiento_prolongado: Joi.string().allow(null, '').messages({
    'string.base': 'El tratamiento prolongado debe ser texto',
  }),
  discapacidad: Joi.string().allow(null, '').messages({
    'string.base': 'La discapacidad debe ser texto',
  }),
  adicciones: Joi.string().allow(null, '').messages({
    'string.base': 'Las adicciones deben ser texto',
  }),
});

module.exports = { updateSaludSchema };
