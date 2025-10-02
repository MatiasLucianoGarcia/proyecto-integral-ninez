const express = require('express');
const router = express.Router();
const viviendaController = require('../controllers/viviendaController');
const { authenticate } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const viviendaSchema = require('../validators/viviendaSchema');

// Todos los roles logueados pueden acceder
router.get('/actual/:dni', authenticate, viviendaController.obtenerUltimaViviendaPorDni);
router.get('/:dni', authenticate, viviendaController.obtenerViviendas);
router.post('/', authenticate, validar(viviendaSchema), viviendaController.crearVivienda);
router.delete('/:id', authenticate, viviendaController.eliminarVivienda);

module.exports = router;
