const express = require('express');
const router = express.Router();
const nacionalidadController = require('../controllers/nacionalidadController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createNacionalidadSchema, updateNacionalidadSchema } = require('../validators/nacionalidadSchema');

// ABM solo para Administrador
router.get('/', authenticate, authorizeRoles('Administrador'), nacionalidadController.obtenerNacionalidades);
router.post('/', authenticate, authorizeRoles('Administrador'), validar(createNacionalidadSchema), nacionalidadController.crearNacionalidad);
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateNacionalidadSchema), nacionalidadController.actualizarNacionalidad);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), nacionalidadController.eliminarNacionalidad);

module.exports = router;
