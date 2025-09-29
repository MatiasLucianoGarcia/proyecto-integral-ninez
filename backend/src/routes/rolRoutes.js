const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const rolController = require('../controllers/rolController');
const validar = require('../middlewares/validatorMiddleware');
const { createRolSchema, updateRolSchema } = require('../validators/rolSchema');

// ABM solo para admin
router.post('/', authenticate, authorizeRoles('Administrador'), validar(createRolSchema), rolController.crearRol);
router.get('/', authenticate, authorizeRoles('Administrador'), rolController.obtenerRoles);
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateRolSchema), rolController.actualizarRol);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), rolController.eliminarRol);

module.exports = router;
