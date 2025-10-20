const tipoViviendaService = require('../services/tipoViviendaService');

// Crear un nuevo tipo de vivienda
const crearTipoVivienda = async (req, res) => {
  try {
    const nuevoTipo = await tipoViviendaService.crearTipoVivienda(req.body.tipo);
    res.status(201).json(nuevoTipo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tipo de vivienda', error });
  }
};

// Obtener todos los tipos de vivienda
const obtenerTiposVivienda = async (req, res) => {
  try {
    const tipos = await tipoViviendaService.obtenerTiposVivienda();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tipos de vivienda', error });
  }
};

// Actualizar un tipo de vivienda
const actualizarTipoVivienda = async (req, res) => {
  try {
    const tipoActualizado = await tipoViviendaService.actualizarTipoVivienda(
      req.params.id,
      req.body.tipo
    );
    res.json(tipoActualizado);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Error al actualizar tipo de vivienda',
    });
  }
};

// Eliminar un tipo de vivienda
const eliminarTipoVivienda = async (req, res) => {
  try {
    await tipoViviendaService.eliminarTipoVivienda(req.params.id);
    res.json({ message: 'Tipo de vivienda eliminado' });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar tipo de vivienda',
    });
  }
};

module.exports = {
  crearTipoVivienda,
  obtenerTiposVivienda,
  actualizarTipoVivienda,
  eliminarTipoVivienda,
};
