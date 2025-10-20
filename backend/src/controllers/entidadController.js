const entidadService = require('../services/entidadService');

// Obtener todas las entidades
const getEntidades = async (req, res) => {
  try {
    const entidades = await entidadService.getEntidades();
    res.status(200).json(entidades);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error al obtener entidades' });
  }
};

// Crear entidad
const createEntidad = async (req, res) => {
  try {
    const nuevaEntidad = await entidadService.createEntidad(req.body);
    res.status(201).json(nuevaEntidad);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error al crear entidad' });
  }
};

// Actualizar entidad
const updateEntidad = async (req, res) => {
  try {
    const entidadActualizada = await entidadService.updateEntidad(req.params.id, req.body);
    res.status(200).json(entidadActualizada);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error al actualizar entidad' });
  }
};

// Eliminar entidad
const deleteEntidad = async (req, res) => {
  try {
    const resultado = await entidadService.deleteEntidad(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error al eliminar entidad' });
  }
};

module.exports = {
  getEntidades,
  createEntidad,
  updateEntidad,
  deleteEntidad,
};
