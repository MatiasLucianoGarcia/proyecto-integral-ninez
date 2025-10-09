const express = require('express');
const router = express.Router();
const hojaRutaController = require('../controllers/hojaRutaController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createHojaRutaSchema, updateHojaRutaSchema } = require('../validators/hojaRutaSchema');

// Rutas accesibles para cualquier usuario autenticado
router.get('/dni/:dni', authenticate, hojaRutaController.getHojasRutaByDni);
router.get('/servicio/:id', authenticate, hojaRutaController.getHojasRutaByServicioLocalId);
router.get('/:id', authenticate, hojaRutaController.getHojaRutaById);
router.post('/', authenticate, validar(createHojaRutaSchema), hojaRutaController.createHojaRuta);

// Rutas solo para administradores
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateHojaRutaSchema), hojaRutaController.updateHojaRuta);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), hojaRutaController.deleteHojaRuta);

module.exports = router;
