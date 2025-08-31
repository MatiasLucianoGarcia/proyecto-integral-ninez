const express = require('express');
const router = express.Router();
const domicilioController = require('../controllers/domicilioController');
const { authenticate } = require('../middlewares/authMiddleware');

// Todos los roles pueden acceder
router.get('/actual/:dni', authenticate, domicilioController.obtenerUltimoDomicilioPorDni);
router.get('/:dni', authenticate, domicilioController.obtenerDomicilios);
router.post('/', authenticate, domicilioController.crearDomicilio);
router.delete('/:id', authenticate, domicilioController.eliminarDomicilio);

module.exports = router;
