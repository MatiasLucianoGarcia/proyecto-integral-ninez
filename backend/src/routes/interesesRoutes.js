const express = require('express');
const router = express.Router();
const interesesController = require('../controllers/interesesController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { updateInteresesSchema } = require('../validators/interesesSchema');

// Solo usuarios logueados pueden acceder
router.get('/:dni', authenticate, interesesController.obtenerIntereses);
router.put('/:dni', authenticate, validar(updateInteresesSchema), interesesController.actualizarIntereses);

module.exports = router;
