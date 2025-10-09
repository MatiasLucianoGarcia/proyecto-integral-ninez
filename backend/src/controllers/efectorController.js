const efectorService = require('../services/efectorService');

// Crear un nuevo efector
const crearEfector = async (req, res) => {
  try {
    const nuevoEfector = await efectorService.crearEfector(req.body);
    res.status(201).json(nuevoEfector);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear efector', error });
  }
};

// Obtener todos los efectores
const obtenerEfectores = async (req, res) => {
  try {
    const efectores = await efectorService.obtenerEfectores();
    res.json(efectores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener efectores', error });
  }
};

// Obtener un efector por ID
const obtenerEfectorPorId = async (req, res) => {
  try {
    const efector = await efectorService.obtenerEfectorPorId(req.params.id);
    if (!efector) {
      return res.status(404).json({ message: `El efector con id ${req.params.id} no existe` });
    }
    res.json(efector);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener efector', error });
  }
};

// Actualizar efector
const actualizarEfector = async (req, res) => {
  try {
    const efectorActualizado = await efectorService.actualizarEfector(req.params.id, req.body);
    res.json(efectorActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar efector', error });
  }
};

// Eliminar efector
const eliminarEfector = async (req, res) => {
  try {
    await efectorService.eliminarEfector(req.params.id);
    res.json({ message: 'Efector eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar efector', error });
  }
};

module.exports = {
  crearEfector,
  obtenerEfectores,
  obtenerEfectorPorId,
  actualizarEfector,
  eliminarEfector,
};
