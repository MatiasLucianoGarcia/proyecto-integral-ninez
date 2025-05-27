const entidadService = require('../services/entidadService');

const getEntidades = async (req, res) => {
  try {
    const entidades = await entidadService.getEntidades();
    res.json(entidades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener entidades', error });
  }
};

const createEntidad = async (req, res) => {
  try {
    const nuevaEntidad = await entidadService.createEntidad(req.body);
    res.status(201).json(nuevaEntidad);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear entidad', error });
  }
};

const updateEntidad = async (req, res) => {
  try {
    const entidadActualizada = await entidadService.updateEntidad(req.params.id, req.body);
    res.json(entidadActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar entidad', error });
  }
};

const deleteEntidad = async (req, res) => {
  try {
    await entidadService.deleteEntidad(req.params.id);
    res.json({ message: 'Entidad eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar entidad', error });
  }
};

module.exports = {
  getEntidades,
  createEntidad,
  updateEntidad,
  deleteEntidad,
};
