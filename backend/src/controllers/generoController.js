const generoService = require('../services/generoService');

// Obtener todos
const obtenerGeneros = async (req, res) => {
  try {
    const data = await generoService.obtenerGeneros();
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener géneros' });
  }
};

// Crear
const crearGenero = async (req, res) => {
  try {
    const { nombre } = req.body;
    const data = await generoService.crearGenero(nombre);
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al crear género' });
  }
};

// Actualizar
const actualizarGenero = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const data = await generoService.actualizarGenero(id, nombre);
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al actualizar género' });
  }
};

// Eliminar
const eliminarGenero = async (req, res) => {
  try {
    const { id } = req.params;
    await generoService.eliminarGenero(id);
    res.json({ message: 'Género eliminado' });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al eliminar género' });
  }
};

module.exports = {
  obtenerGeneros,
  crearGenero,
  actualizarGenero,
  eliminarGenero,
};
