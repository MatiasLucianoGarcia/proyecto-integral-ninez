const efectorService = require('../services/efectorService');

// Crear efector
const crearEfector = async (req, res) => {
  try {
    const nuevoEfector = await efectorService.crearEfector(req.body);
    res.status(201).json(nuevoEfector);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al crear efector' });
  }
};

// Obtener todos
const obtenerEfectores = async (req, res) => {
  try {
    const efectores = await efectorService.obtenerEfectores();
    res.status(200).json(efectores);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener efectores' });
  }
};

// Obtener por ID
const obtenerEfectorPorId = async (req, res) => {
  try {
    const efector = await efectorService.obtenerEfectorPorId(req.params.id);
    res.status(200).json(efector);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener efector' });
  }
};

// Actualizar efector
const actualizarEfector = async (req, res) => {
  try {
    const efectorActualizado = await efectorService.actualizarEfector(req.params.id, req.body);
    res.status(200).json(efectorActualizado);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al actualizar efector' });
  }
};

// Eliminar efector
const eliminarEfector = async (req, res) => {
  try {
    const resultado = await efectorService.eliminarEfector(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al eliminar efector' });
  }
};

module.exports = {
  crearEfector,
  obtenerEfectores,
  obtenerEfectorPorId,
  actualizarEfector,
  eliminarEfector,
};
