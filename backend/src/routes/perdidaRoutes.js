const express = require('express');
const router = express.Router();
const perdidaController = require('../controllers/perdidaController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const perdidaSchema = require('../validators/perdidaSchema');

// Todos los roles pueden acceder
router.get('/actual/:dni', authenticate, perdidaController.obtenerUltimaPerdidaPorDni);
router.get('/:dni', authenticate, perdidaController.obtenerPerdidas);
router.post('/', authenticate, validar(perdidaSchema), perdidaController.crearPerdida);
router.delete('/:id', authenticate, perdidaController.eliminarPerdida);

module.exports = router;