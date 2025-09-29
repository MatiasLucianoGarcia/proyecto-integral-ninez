const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware'); 
const contactoSchema = require('../validators/contactoSchema');

// Todos los roles pueden acceder
router.get('/actual/:dni', authenticate, contactoController.obtenerUltimoContactoPorDni);
router.get('/:dni', authenticate, contactoController.obtenerContactos);
router.post('/', authenticate, validar(contactoSchema), contactoController.crearContacto);
router.delete('/:id', authenticate, contactoController.eliminarContacto);

module.exports = router;
