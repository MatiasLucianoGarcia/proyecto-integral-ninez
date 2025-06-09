const generoService = require('../services/generoService');

const obtenerGeneros = async (req, res) => {
  const { data, error } = await generoService.obtenerGeneros();
  if (error) return res.status(500).json({ message: 'Error al obtener géneros', error });
  res.json(data);
};

const crearGenero = async (req, res) => {
  const { nombre } = req.body;
  const { data, error } = await generoService.crearGenero(nombre);
  if (error) return res.status(500).json({ message: 'Error al crear género', error });
  res.status(201).json(data[0]);
};

const actualizarGenero = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  const { data, error } = await generoService.actualizarGenero(id, nombre);
  if (error) return res.status(500).json({ message: 'Error al actualizar género', error });
  res.json(data[0]);
};

const eliminarGenero = async (req, res) => {
  const { id } = req.params;
  const { error } = await generoService.eliminarGenero(id);
  if (error) return res.status(500).json({ message: 'Error al eliminar género', error });
  res.json({ message: 'Género eliminado' });
};

module.exports = {
  obtenerGeneros,
  crearGenero,
  actualizarGenero,
  eliminarGenero,
};
