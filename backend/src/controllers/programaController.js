const programaService = require('../services/programaService');

// Crear un nuevo programa
const crearPrograma = async (req, res) => {
  try {
    const nuevoPrograma = await programaService.crearPrograma(req.body);
    res.status(201).json(nuevoPrograma);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Error al crear programa',
    });
  }
};

// Obtener todos los programas
const obtenerProgramas = async (req, res) => {
  try {
    const programas = await programaService.obtenerProgramas();
    res.json(programas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener programas', error });
  }
};

// Obtener programa por ID
const obtenerProgramaPorId = async (req, res) => {
  try {
    const programa = await programaService.obtenerProgramaPorId(req.params.id);
    res.json(programa);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener programa',
    });
  }
};

// Actualizar programa
const actualizarPrograma = async (req, res) => {
  try {
    const programaActualizado = await programaService.actualizarPrograma(req.params.id, req.body);
    res.json(programaActualizado);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Error al actualizar programa',
    });
  }
};

// Eliminar programa
const eliminarPrograma = async (req, res) => {
  try {
    const result = await programaService.eliminarPrograma(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar programa',
    });
  }
};

module.exports = {
  crearPrograma,
  obtenerProgramas,
  obtenerProgramaPorId,
  actualizarPrograma,
  eliminarPrograma,
};
