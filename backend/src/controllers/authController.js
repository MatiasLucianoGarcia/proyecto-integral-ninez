const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { token, usuario } = await authService.loginUser(req.body);
    res.json({ token, usuario });
  } catch (error) {
    const isAuthError = [
      'Usuario no encontrado',
      'Contraseña incorrecta',
      'El usuario no tiene un rol asignado',
    ].includes(error.message);

    res.status(isAuthError ? 401 : 500).json({ message: error.message });
  }
};

module.exports = { login };
