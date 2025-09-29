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

module.exports = router;
