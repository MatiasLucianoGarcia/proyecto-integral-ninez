const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createGeneroSchema, updateGeneroSchema } = require('../validators/generoSchema');

// ABM solo para Administrador
router.get('/', authenticate, authorizeRoles('Administrador'), generoController.obtenerGeneros);
router.post('/', authenticate, authorizeRoles('Administrador'), validar(createGeneroSchema), generoController.crearGenero);
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateGeneroSchema), generoController.actualizarGenero);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), generoController.eliminarGenero);

module.exports = router;
