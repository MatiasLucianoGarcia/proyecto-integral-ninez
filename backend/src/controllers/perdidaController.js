const perdidaService = require('../services/perdidaService');
const historialService = require('../services/historialService');

// Crear pérdida
const crearPerdida = async (req, res) => {
  try {
    const { dni, descripcion, fecha_real } = req.body;
    const nuevaPerdida = await perdidaService.crearPerdida(dni, descripcion, fecha_real);

    const intervencion = `El usuario ${req.user.nombre} añadió una nueva pérdida para esta persona`;

    await historialService.createHistorial({
      dni,
      intervencion,
      resultado: "Alta de pérdida exitosa",
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevaPerdida);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al crear pérdida' });
  }
};

// Obtener pérdidas por DNI
const obtenerPerdidas = async (req, res) => {
  try {
    const { dni } = req.params;
    const perdidas = await perdidaService.obtenerPerdidas(dni);
    res.status(200).json(perdidas);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener pérdidas' });
  }
};

// Eliminar pérdida
const eliminarPerdida = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await perdidaService.eliminarPerdida(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al eliminar pérdida' });
  }
};

// Obtener última pérdida por DNI
const obtenerUltimaPerdidaPorDni = async (req, res) => {
  try {
    const { dni } = req.params;
    const perdida = await perdidaService.obtenerUltimaPerdidaPorDni(dni);
    res.status(200).json(perdida);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener última pérdida' });
  }
};

module.exports = {
  crearPerdida,
  obtenerPerdidas,
  eliminarPerdida,
  obtenerUltimaPerdidaPorDni,
};
