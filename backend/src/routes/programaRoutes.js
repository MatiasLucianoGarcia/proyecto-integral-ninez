const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createProgramaSchema, updateProgramaSchema } = require('../validators/programaSchema');

// Todos los autenticados pueden:
router.get('/', authenticate, programaController.obtenerProgramas);
router.get('/:id', authenticate, programaController.obtenerProgramaPorId);
router.post('/', authenticate, validar(createProgramaSchema), programaController.crearPrograma);

// Solo los administradores pueden:
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateProgramaSchema), programaController.actualizarPrograma);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), programaController.eliminarPrograma);

module.exports = router;
