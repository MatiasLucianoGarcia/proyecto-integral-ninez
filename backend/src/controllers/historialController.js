const historialService = require("../services/historialService");
const { crearHistorialSchema, actualizarHistorialSchema } = require("../validators/historialSchema");

const historialController = {
  async getHistorialPorDni(req, res) {
    try {
      const { dni } = req.params;
      const data = await historialService.getHistorialPorDni(Number(dni));
      res.status(200).json(data);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Error al obtener el historial" });
    }
  },

  async getHistorialPorId(req, res) {
    try {
      const { id } = req.params;
      const data = await historialService.getHistorialPorId(Number(id));
      res.status(200).json(data);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Error al obtener el historial" });
    }
  },

  async crearHistorial(req, res) {
    try {
      const { error } = crearHistorialSchema.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const data = await historialService.createHistorial(req.body);
      res.status(201).json(data);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Error al crear el historial" });
    }
  },

  async actualizarHistorial(req, res) {
    try {
      const { id } = req.params;
      const { error } = actualizarHistorialSchema.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const data = await historialService.actualizarHistorial(Number(id), req.body);
      res.status(200).json(data);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Error al actualizar el historial" });
    }
  },

  async eliminarHistorial(req, res) {
    try {
      const { id } = req.params;
      const data = await historialService.eliminarHistorial(Number(id));
      res.status(200).json(data);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Error al eliminar el historial" });
    }
  },
};

module.exports = historialController;
