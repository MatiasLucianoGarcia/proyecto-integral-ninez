const express = require('express');
const router = express.Router();
const controlMedicoController = require('../controllers/controlMedicoController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const controlMedicoSchema = require('../validators/controlMedicoSchema');

// Todos los roles pueden acceder
router.get('/actual/:dni', authenticate, controlMedicoController.obtenerUltimoControlMedicoPorDni);
router.get('/:dni', authenticate, controlMedicoController.obtenerControlesMedicos);
router.post('/', authenticate, validar(controlMedicoSchema), controlMedicoController.crearControlMedico);
router.delete('/:id', authenticate, controlMedicoController.eliminarControlMedico);

module.exports = router;
