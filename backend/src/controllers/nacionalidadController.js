const nacionalidadService = require('../services/nacionalidadService');

const obtenerNacionalidades = async (req, res) => {
  try {
    const data = await nacionalidadService.getNacionalidades();
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const crearNacionalidad = async (req, res) => {
  const { nombre } = req.body;
  try {
    const nueva = await nacionalidadService.createNacionalidad(nombre);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const actualizarNacionalidad = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const actualizada = await nacionalidadService.updateNacionalidad(id, nombre);
    res.json(actualizada);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const eliminarNacionalidad = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await nacionalidadService.deleteNacionalidad(id);
    res.json(resultado);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  obtenerNacionalidades,
  crearNacionalidad,
  actualizarNacionalidad,
  eliminarNacionalidad,
};
