const express = require('express');
const router = express.Router();
const condicionesVidaController = require('../controllers/condicionesVidaController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { updateCondicionesVidaSchema } = require('../validators/condicionesVidaSchema');

// Solo logueados
router.get('/:dni', authenticate, condicionesVidaController.obtenerCondicionesVida);
router.put('/:dni', authenticate, validar(updateCondicionesVidaSchema), condicionesVidaController.actualizarCondicionesVida);

module.exports = router;
