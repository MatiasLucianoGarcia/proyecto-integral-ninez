const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const entidadController = require('../controllers/entidadController');
const validar = require('../middlewares/validatorMiddleware'); 
const { createEntidadSchema, updateEntidadSchema } = require('../validators/entidadSchema');

// ABM solo para admin
router.get('/', authenticate, authorizeRoles('Administrador'),entidadController.getEntidades);
router.post('/', authenticate, authorizeRoles('Administrador'), validar(createEntidadSchema), entidadController.createEntidad);
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateEntidadSchema), entidadController.updateEntidad);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), entidadController.deleteEntidad);

module.exports = router;
