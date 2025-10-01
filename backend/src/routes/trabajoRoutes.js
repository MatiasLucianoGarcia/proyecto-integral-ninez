const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const trabajoSchema = require('../validators/trabajoSchema');

// Rutas
router.get('/actual/:dni', authenticate, trabajoController.obtenerUltimoTrabajoPorDni);
router.get('/:dni', authenticate, trabajoController.obtenerTrabajos);
router.post('/', authenticate, validar(trabajoSchema), trabajoController.crearTrabajo);
router.delete('/:id', authenticate, trabajoController.eliminarTrabajo);

module.exports = router;
