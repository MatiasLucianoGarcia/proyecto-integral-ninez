const familiaService = require('../services/familiaService');

// Consultar por DNI
const obtenerFamiliaPorDni = async (req, res) => {
  try {
    const familia = await familiaService.obtenerFamiliaPorDni(req.params.dni);
    res.json(familia);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener familia', error: error.message });
  }
};

// Crear familia
const crearFamilia = async (req, res) => {
  try {
    const nuevaFamilia = await familiaService.crearFamilia(req.body);
    res.status(201).json(nuevaFamilia);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al crear familia" });
  }
};


// Actualizar familia
const actualizarFamilia = async (req, res) => {
  try {
    const familiaActualizada = await familiaService.actualizarFamilia(req.params.id, req.body);
    res.json(familiaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar familia', error: error.message });
  }
};

// Eliminar familia
const eliminarFamilia = async (req, res) => {
  try {
    await familiaService.eliminarFamilia(req.params.id);
    res.json({ message: 'Familia eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar familia', error: error.message });
  }
};

module.exports = {
  obtenerFamiliaPorDni,
  crearFamilia,
  actualizarFamilia,
  eliminarFamilia,
};