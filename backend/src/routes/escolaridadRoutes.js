const express = require('express');
const router = express.Router();
const escolaridadController = require('../controllers/escolaridadController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const escolaridadSchema = require('../validators/escolaridadSchema');

// Todos los roles pueden acceder
router.get('/actual/:dni', authenticate, escolaridadController.obtenerUltimaEscolaridadPorDni);
router.get('/:dni', authenticate, escolaridadController.obtenerEscolaridades);
router.post('/', authenticate, validar(escolaridadSchema), escolaridadController.crearEscolaridad);
router.delete('/:id', authenticate, escolaridadController.eliminarEscolaridad);

module.exports = router;
