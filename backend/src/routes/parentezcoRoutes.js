const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const parentezcoController = require('../controllers/parentezcoController');
const validar = require('../middlewares/validatorMiddleware');
const { createParentezcoSchema, updateParentezcoSchema } = require('../validators/parentezcoSchema');

// ABM solo para admin
router.post('/', authenticate, authorizeRoles('Administrador'), validar(createParentezcoSchema), parentezcoController.crearParentezco);
router.get('/', authenticate, authorizeRoles('Administrador'), parentezcoController.obtenerParentezcos);
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateParentezcoSchema), parentezcoController.actualizarParentezco);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), parentezcoController.eliminarParentezco);

module.exports = router;
