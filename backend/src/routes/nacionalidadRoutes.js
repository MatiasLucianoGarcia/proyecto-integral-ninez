const express = require('express');
const router = express.Router();
const nacionalidadController = require('../controllers/nacionalidadController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

// ABM solo para Administrador
router.get('/', authenticate, authorizeRoles('Administrador'), nacionalidadController.obtenerNacionalidades);
router.post('/', authenticate, authorizeRoles('Administrador'), nacionalidadController.crearNacionalidad);
router.put('/:id', authenticate, authorizeRoles('Administrador'), nacionalidadController.actualizarNacionalidad);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), nacionalidadController.eliminarNacionalidad);

module.exports = router;
