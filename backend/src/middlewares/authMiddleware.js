const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token faltante' });

  const token = authHeader.split(' ')[1];

  try {
    const user = verifyToken(token);
    req.user = user; // Adjuntamos el usuario a la request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles
};