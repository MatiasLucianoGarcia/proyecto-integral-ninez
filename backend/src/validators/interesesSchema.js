const Joi = require('joi');

const updateInteresesSchema = Joi.object({
  gustos: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Los gustos deben ser texto',
    }),

  vinculos_significativos: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Los vínculos significativos deben ser texto',
    }),

  datos_desarrollo: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Los datos de desarrollo deben ser texto',
    }),
});

module.exports = { updateInteresesSchema };
