const interesesService = require('../services/interesesService');

const obtenerIntereses = async (req, res) => {
  try {
    const dni = req.params.dni;
    const intereses = await interesesService.obtenerIntereses(dni);
    res.json(intereses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener intereses', error });
  }
};

const actualizarIntereses = async (req, res) => {
  try {
    const dni = req.params.dni;
    const actualizados = await interesesService.actualizarIntereses(dni, req.body);
    res.json(actualizados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar intereses', error });
  }
};

module.exports = {
  obtenerIntereses,
  actualizarIntereses,
};
