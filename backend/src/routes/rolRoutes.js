const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const rolController = require('../controllers/rolController');

// ABM solo para admin
router.post('/', authenticate, authorizeRoles('Administrador'), rolController.crearRol);
router.get('/', authenticate, authorizeRoles('Administrador'), rolController.obtenerRoles);
router.put('/:id', authenticate, authorizeRoles('Administrador'), rolController.actualizarRol);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), rolController.eliminarRol);

module.exports = router;
