const programaService = require('../services/programaService');

// Crear un nuevo programa
const crearPrograma = async (req, res) => {
  try {
    const nuevoPrograma = await programaService.crearPrograma(req.body);
    res.status(201).json(nuevoPrograma);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear programa', error });
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
    if (!programa) return res.status(404).json({ message: 'Programa no encontrado' });
    res.json(programa);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener programa', error });
  }
};

// Actualizar programa
const actualizarPrograma = async (req, res) => {
  try {
    const programaActualizado = await programaService.actualizarPrograma(req.params.id, req.body);
    if (!programaActualizado) return res.status(404).json({ message: 'Programa no encontrado' });
    res.json(programaActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar programa', error });
  }
};

// Eliminar programa
const eliminarPrograma = async (req, res) => {
  try {
    await programaService.eliminarPrograma(req.params.id);
    res.json({ message: 'Programa eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar programa', error });
  }
};

module.exports = {
  crearPrograma,
  obtenerProgramas,
  obtenerProgramaPorId,
  actualizarPrograma,
  eliminarPrograma,
};
