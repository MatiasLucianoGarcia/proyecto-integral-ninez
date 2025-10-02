const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const tipoViviendaController = require('../controllers/tipoViviendaController');
const validar = require('../middlewares/validatorMiddleware');
const { createTipoViviendaSchema, updateTipoViviendaSchema } = require('../validators/tipoViviendaSchema');

// ABM solo para admin
router.post('/', authenticate, authorizeRoles('Administrador'), validar(createTipoViviendaSchema), tipoViviendaController.crearTipoVivienda);
router.get('/', authenticate, authorizeRoles('Administrador'), tipoViviendaController.obtenerTiposVivienda);
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateTipoViviendaSchema), tipoViviendaController.actualizarTipoVivienda);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), tipoViviendaController.eliminarTipoVivienda);

module.exports = router;
