const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createUsuarioSchema, updateUsuarioSchema } = require('../validators/usuarioSchema');

// Solo admin puede crear, editar o borrar usuarios
router.post('/', authenticate, authorizeRoles('Administrador'), validar(createUsuarioSchema), usuarioController.createUsuario);
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateUsuarioSchema), usuarioController.updateUsuario);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), usuarioController.deleteUsuario);

// Cualquier usuario autenticado puede consultar su propio perfil
router.get('/:id', authenticate, usuarioController.getUsuarioById);

// Cualquier usuario autenticado puede cambiar SU PROPIA contraseña
// Usa el ID del token, no requiere ID en la URL para mayor seguridad
router.put('/perfil/clave', authenticate, usuarioController.updateMyPassword);

module.exports = router;
