const express = require('express');
const router = express.Router();
const equipoLocalController = require('../controllers/equipoLocalController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createEquipoLocalSchema, updateEquipoLocalSchema } = require('../validators/equipoLocalSchema');

// Todos los autenticados pueden:
router.get('/', authenticate, equipoLocalController.obtenerEquiposLocales);
router.get('/:id', authenticate, equipoLocalController.obtenerEquipoLocalPorId);
router.post('/', authenticate, validar(createEquipoLocalSchema), equipoLocalController.crearEquipoLocal);

// Solo los administradores pueden:
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateEquipoLocalSchema), equipoLocalController.actualizarEquipoLocal);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), equipoLocalController.eliminarEquipoLocal);

module.exports = router;
