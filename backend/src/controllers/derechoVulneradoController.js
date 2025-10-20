const derechoVulneradoService = require('../services/derechoVulneradoService');

// Crear
const crearDerechoVulnerado = async (req, res) => {
  try {
    const nuevo = await derechoVulneradoService.crearDerechoVulnerado(req.body.descripcion);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al crear derecho vulnerado' });
  }
};

// Obtener todos
const obtenerDerechosVulnerados = async (req, res) => {
  try {
    const derechos = await derechoVulneradoService.obtenerDerechosVulnerados();
    res.status(200).json(derechos);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener derechos vulnerados' });
  }
};

// Obtener por ID
const obtenerDerechoVulneradoPorId = async (req, res) => {
  try {
    const derecho = await derechoVulneradoService.obtenerDerechoVulneradoPorId(req.params.id);
    res.status(200).json(derecho);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener derecho vulnerado' });
  }
};

// Actualizar
const actualizarDerechoVulnerado = async (req, res) => {
  try {
    const actualizado = await derechoVulneradoService.actualizarDerechoVulnerado(
      req.params.id,
      req.body.descripcion
    );
    res.status(200).json(actualizado);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al actualizar derecho vulnerado' });
  }
};

// Eliminar
const eliminarDerechoVulnerado = async (req, res) => {
  try {
    const resultado = await derechoVulneradoService.eliminarDerechoVulnerado(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al eliminar derecho vulnerado' });
  }
};

module.exports = {
  crearDerechoVulnerado,
  obtenerDerechosVulnerados,
  obtenerDerechoVulneradoPorId,
  actualizarDerechoVulnerado,
  eliminarDerechoVulnerado,
};
