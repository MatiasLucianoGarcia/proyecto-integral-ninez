const {
  crearIngreso,
  obtenerTodosLosIngresos,
  obtenerIngresoPorId,
  obtenerIngresosPorDni,
  actualizarIngreso,
  eliminarIngreso,
} = require('../services/ingresoService');

// Obtener todos los ingresos
const getAllIngresos = async (req, res) => {
  try {
    const ingresos = await obtenerTodosLosIngresos();
    res.json(ingresos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener ingreso por ID
const getIngresoById = async (req, res) => {
  try {
    const { id } = req.params;
    const ingreso = await obtenerIngresoPorId(id);
    res.json(ingreso);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Obtener ingresos por DNI
const getIngresosByDni = async (req, res) => {
  try {
    const { dni } = req.params;
    const ingresos = await obtenerIngresosPorDni(dni);
    res.json(ingresos);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Crear ingreso
const createIngreso = async (req, res) => {
  try {
    const nuevo = await crearIngreso(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Actualizar ingreso
const updateIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await actualizarIngreso(id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Eliminar ingreso
const deleteIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarIngreso(id);
    res.json({ message: 'Ingreso eliminado correctamente' });
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

module.exports = {
  getAllIngresos,
  getIngresoById,
  getIngresosByDni,
  createIngreso,
  updateIngreso,
  deleteIngreso,
};
