const derechoVulneradoService = require('../services/derechoVulneradoService');

const crearDerechoVulnerado = async (req, res) => {
  try {
    const nuevo = await derechoVulneradoService.crearDerechoVulnerado(req.body.descripcion);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear derecho vulnerado', error });
  }
};

const obtenerDerechosVulnerados = async (req, res) => {
  try {
    const derechos = await derechoVulneradoService.obtenerDerechosVulnerados();
    res.json(derechos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener derechos vulnerados', error });
  }
};

const obtenerDerechoVulneradoPorId = async (req, res) => {
  try {
    const derecho = await derechoVulneradoService.obtenerDerechoVulneradoPorId(req.params.id);
    if (!derecho) {
      return res.status(404).json({ message: 'El derecho vulnerado con ese ID no existe' });
    }
    res.json(derecho);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener derecho vulnerado', error });
  }
};

const actualizarDerechoVulnerado = async (req, res) => {
  try {
    const actualizado = await derechoVulneradoService.actualizarDerechoVulnerado(req.params.id, req.body.descripcion);
    if (!actualizado) {
      return res.status(404).json({ message: 'El derecho vulnerado con ese ID no existe' });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar derecho vulnerado', error });
  }
};

const eliminarDerechoVulnerado = async (req, res) => {
  try {
    await derechoVulneradoService.eliminarDerechoVulnerado(req.params.id);
    res.json({ message: 'Derecho vulnerado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar derecho vulnerado', error });
  }
};

module.exports = {
  crearDerechoVulnerado,
  obtenerDerechosVulnerados,
  obtenerDerechoVulneradoPorId,
  actualizarDerechoVulnerado,
  eliminarDerechoVulnerado,
};
