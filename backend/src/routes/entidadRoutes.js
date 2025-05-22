const express = require('express');
const router = express.Router();
const entidadController = require('../controllers/entidadController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

// ABM solo para admin
router.get('/', authenticate, authorizeRoles('Administrador'),entidadController.getEntidades);
router.post('/', authenticate, authorizeRoles('Administrador'), entidadController.createEntidad);
router.put('/:id', authenticate, authorizeRoles('Administrador'), entidadController.updateEntidad);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), entidadController.deleteEntidad);

module.exports = router;
