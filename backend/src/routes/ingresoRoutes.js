const express = require('express');
const router = express.Router();
const ingresoController = require('../controllers/ingresoController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createIngresoSchema, updateIngresoSchema } = require('../validators/ingresoSchema');

// Rutas accesibles para cualquier usuario autenticado
router.get('/', authenticate, ingresoController.getAllIngresos); // 👈 nuevo endpoint
router.get('/dni/:dni', authenticate, ingresoController.getIngresosByDni);
router.get('/:id', authenticate, ingresoController.getIngresoById);
router.post('/', authenticate, validar(createIngresoSchema), ingresoController.createIngreso);

// Rutas solo para administradores
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateIngresoSchema), ingresoController.updateIngreso);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), ingresoController.deleteIngreso);

module.exports = router;
