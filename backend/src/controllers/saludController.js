const saludService = require('../services/saludService');

const obtenerSalud = async (req, res) => {
  try {
    const dni = req.params.dni;
    const salud = await saludService.obtenerSalud(dni);
    res.json(salud);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener salud', error });
  }
};

const actualizarSalud = async (req, res) => {
  try {
    const dni = req.params.dni;
    const actualizada = await saludService.actualizarSalud(dni, req.body);
    res.json(actualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar salud', error });
  }
};

module.exports = {
  obtenerSalud,
  actualizarSalud,
};
