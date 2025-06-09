const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

// ABM solo para Administrador
router.get('/', authenticate, authorizeRoles('Administrador'), generoController.obtenerGeneros);
router.post('/', authenticate, authorizeRoles('Administrador'), generoController.crearGenero);
router.put('/:id', authenticate, authorizeRoles('Administrador'), generoController.actualizarGenero);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), generoController.eliminarGenero);

module.exports = router;
