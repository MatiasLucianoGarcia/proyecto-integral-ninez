const usuarioService = require('../services/usuarioService');

// Crear usuario
const createUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al crear usuario",
    });
  }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.id);
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al obtener usuario",
    });
  }
};

// Actualizar usuario
const updateUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await usuarioService.updateUsuario(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al actualizar usuario",
    });
  }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
  try {
    await usuarioService.deleteUsuario(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al eliminar usuario",
    });
  }
};

module.exports = {
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
};
