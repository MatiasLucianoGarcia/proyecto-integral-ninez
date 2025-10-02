const Joi = require('joi');

const updateCondicionesVidaSchema = Joi.object({
  acceso_luz: Joi.boolean().allow(null),
  acceso_gas: Joi.boolean().allow(null),
  acceso_agua: Joi.boolean().allow(null),
  acceso_internet: Joi.boolean().allow(null),
  alimentos_propios: Joi.boolean().allow(null),
});

module.exports = { updateCondicionesVidaSchema };
