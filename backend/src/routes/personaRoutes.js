const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');
const { authenticate } = require('../middlewares/authMiddleware');

// Todos los roles pueden acceder
router.get('/', authenticate, personaController.getPersonas);
router.post('/', authenticate, personaController.createPersona);
router.put('/:dni', authenticate, personaController.updatePersona);
router.delete('/:dni', authenticate, personaController.deletePersona);

module.exports = router;
