const express = require('express');
const router = express.Router();
const derechoVulneradoController = require('../controllers/derechoVulneradoController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createDerechoVulneradoSchema, updateDerechoVulneradoSchema } = require('../validators/derechoVulneradoSchema');

// Todos los autenticados pueden:
router.get('/', authenticate, derechoVulneradoController.obtenerDerechosVulnerados);
router.get('/:id', authenticate, derechoVulneradoController.obtenerDerechoVulneradoPorId);
router.post('/', authenticate, validar(createDerechoVulneradoSchema), derechoVulneradoController.crearDerechoVulnerado);

// Solo los administradores pueden:
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateDerechoVulneradoSchema), derechoVulneradoController.actualizarDerechoVulnerado);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), derechoVulneradoController.eliminarDerechoVulnerado);

module.exports = router;
