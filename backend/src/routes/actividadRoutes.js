const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const actividadSchema = require('../validators/actividadSchema');

// Todos los roles pueden acceder
router.get('/actual/:dni', authenticate, actividadController.obtenerUltimaActividadPorDni);
router.get('/:dni', authenticate, actividadController.obtenerActividades);
router.post('/', authenticate, validar(actividadSchema), actividadController.crearActividad);
router.delete('/:id', authenticate, actividadController.eliminarActividad);

module.exports = router;
