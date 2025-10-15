const Joi = require("joi");

const crearHistorialSchema = Joi.object({
  dni: Joi.number().integer().required().messages({
    "number.base": "El DNI debe ser un número",
    "any.required": "El DNI es obligatorio",
  }),
  intervencion: Joi.string().required().messages({
    "any.required": "La intervención es obligatoria",
  }),
  resultado: Joi.string().allow(null, ""),
});

const actualizarHistorialSchema = Joi.object({
  intervencion: Joi.string(),
  resultado: Joi.string().allow(null, ""),
}).min(1).messages({
  "object.min": "Debe enviar al menos un campo para actualizar",
});

module.exports = {
  crearHistorialSchema,
  actualizarHistorialSchema,
};