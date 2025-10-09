const express = require('express');
const router = express.Router();
const servicioLocalController = require('../controllers/servicioLocalController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createServicioLocalSchema, updateServicioLocalSchema } = require('../validators/servicioLocalSchema');

// Todos los autenticados
router.get('/', authenticate, servicioLocalController.getAllServicioLocal);
router.get('/dni/:dni', authenticate, servicioLocalController.getServiciosLocalesByDni);
router.get('/:id', authenticate, servicioLocalController.getServicioLocalById);
router.post('/', authenticate, validar(createServicioLocalSchema), servicioLocalController.createServicioLocal);

// Solo administradores
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateServicioLocalSchema), servicioLocalController.updateServicioLocal);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), servicioLocalController.deleteServicioLocal);

module.exports = router;
