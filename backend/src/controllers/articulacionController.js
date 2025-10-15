const {
  crearArticulacion,
  obtenerArticulacionesPorDni,
  obtenerArticulacionesPorDniEIngreso,
  obtenerArticulacionPorId,
  actualizarArticulacion,
  eliminarArticulacion,
} = require('../services/articulacionService');

// Obtener todas por DNI
const getArticulacionesByDni = async (req, res) => {
  try {
    const { dni } = req.params;
    const articulaciones = await obtenerArticulacionesPorDni(dni);
    res.json(articulaciones);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Obtener por DNI e ID de ingreso
const getArticulacionesByDniAndIngreso = async (req, res) => {
  try {
    const { dni, id_ingreso } = req.params;
    const articulaciones = await obtenerArticulacionesPorDniEIngreso(dni, id_ingreso);
    res.json(articulaciones);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Obtener por ID de articulación
const getArticulacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const articulacion = await obtenerArticulacionPorId(id);
    res.json(articulacion);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Crear articulación
const createArticulacion = async (req, res) => {
  try {
    const nueva = await crearArticulacion(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Actualizar articulación
const updateArticulacion = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizada = await actualizarArticulacion(id, req.body);
    res.json(actualizada);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Eliminar articulación
const deleteArticulacion = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarArticulacion(id);
    res.json({ message: 'Articulacion eliminada correctamente' });
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

module.exports = {
  getArticulacionesByDni,
  getArticulacionesByDniAndIngreso,
  getArticulacionById,
  createArticulacion,
  updateArticulacion,
  deleteArticulacion,
};
