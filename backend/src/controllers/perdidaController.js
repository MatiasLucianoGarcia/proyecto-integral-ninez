const perdidaService = require('../services/perdidaService');
const historialService = require('../services/historialService');

// POST
const crearPerdida = async (req, res) => {
  try {
    const nuevaPerdida = await perdidaService.crearPerdida(
      req.body.dni,
      req.body.descripcion
    );

    // Intervención
    const intervencion = `El usuario ${req.user.nombre} añadió una pérdida para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de pérdida exitosa",
    });

    res.status(201).json(nuevaPerdida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear pérdida', error });
  }
};

// GET todas
const obtenerPerdidas = async (req, res) => {
  try {
    const dni = req.params.dni;
    const perdidas = await perdidaService.obtenerPerdidas(dni);
    res.json(perdidas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener pérdidas', error });
  }
};

// DELETE
const eliminarPerdida = async (req, res) => {
  try {
    const id = req.params.id;
    await perdidaService.eliminarPerdida(id);
    res.json({ message: 'Pérdida eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar pérdida', error });
  }
};

// GET última
const obtenerUltimaPerdidaPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const perdida = await perdidaService.obtenerUltimaPerdidaPorDni(dni);
    res.json(perdida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener última pérdida', error });
  }
};

module.exports = {
  crearPerdida,
  obtenerPerdidas,
  eliminarPerdida,
  obtenerUltimaPerdidaPorDni
};
