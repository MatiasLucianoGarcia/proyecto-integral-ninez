const express = require('express');
const router = express.Router();
const saludController = require('../controllers/saludController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { updateSaludSchema } = require('../validators/saludSchema');

// Solo logueados
router.get('/:dni', authenticate, saludController.obtenerSalud);
router.put('/:dni', authenticate, validar(updateSaludSchema), saludController.actualizarSalud);

module.exports = router;
