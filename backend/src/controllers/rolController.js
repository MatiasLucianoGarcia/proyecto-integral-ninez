const rolService = require('../services/rolService');

// Crear un nuevo rol
const crearRol = async (req, res) => {
  try {
    const nuevoRol = await rolService.crearRol(req.body.nombre_rol);
    res.status(201).json(nuevoRol);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear rol', error });
  }
};

// Obtener todos los roles
const obtenerRoles = async (req, res) => {
  try {
    const roles = await rolService.obtenerRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles', error });
  }
};

// Actualizar un rol
const actualizarRol = async (req, res) => {
  try {
    const rolActualizado = await rolService.actualizarRol(req.params.id, req.body.nombre_rol);
    res.json(rolActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar rol', error });
  }
};

// Eliminar un rol
const eliminarRol = async (req, res) => {
  try {
    await rolService.eliminarRol(req.params.id);
    res.json({ message: 'Rol eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar rol', error });
  }
};

module.exports = {
  crearRol,
  obtenerRoles,
  actualizarRol,
  eliminarRol,
};
