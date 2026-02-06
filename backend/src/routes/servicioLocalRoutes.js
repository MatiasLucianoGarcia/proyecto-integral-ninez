const express = require('express');
const router = express.Router();
const servicioLocalController = require('../controllers/servicioLocalController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createServicioLocalSchema, updateServicioLocalSchema } = require('../validators/servicioLocalSchema');

// Todos los autenticados
router.get('/', authenticate, authorizeRoles('Administrador', 'Proteccion'), servicioLocalController.getAllServicioLocal);
router.get('/dni/:dni', authenticate, servicioLocalController.getServiciosLocalesByDni);
router.get('/:id', authenticate, authorizeRoles('Administrador', 'Proteccion'), servicioLocalController.getServicioLocalById);
router.post('/', authenticate, authorizeRoles('Administrador', 'Proteccion'), validar(createServicioLocalSchema), servicioLocalController.createServicioLocal);

// Solo administradores
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateServicioLocalSchema), servicioLocalController.updateServicioLocal);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), servicioLocalController.deleteServicioLocal);

module.exports = router;
