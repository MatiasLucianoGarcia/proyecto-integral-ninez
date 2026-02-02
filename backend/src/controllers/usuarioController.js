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

// Obtener todos los usuarios
const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al obtener usuarios",
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

// Actualizar contraseña propia
const updateMyPassword = async (req, res) => {
  try {
    // Seguridad: Usar el ID del token, no del body ni params
    const idUsuario = req.user.id;
    const { contraseña } = req.body;

    if (!contraseña || contraseña.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    await usuarioService.updatePassword(idUsuario, contraseña);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al actualizar contraseña",
    });
  }
};

module.exports = {
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  updateMyPassword,
  deleteUsuario,
};
