const express = require('express');
const router = express.Router();
const efectorController = require('../controllers/efectorController');
const validar = require('../middlewares/validatorMiddleware');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const { createEfectorSchema, updateEfectorSchema } = require('../validators/efectorSchema');

// Todos los usuarios autenticados pueden listar y crear
router.get('/', authenticate, efectorController.obtenerEfectores);
router.get('/:id', authenticate, efectorController.obtenerEfectorPorId);
router.post('/', authenticate, validar(createEfectorSchema), efectorController.crearEfector);

// Solo administradores pueden modificar o eliminar
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateEfectorSchema), efectorController.actualizarEfector);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), efectorController.eliminarEfector);

module.exports = router;
