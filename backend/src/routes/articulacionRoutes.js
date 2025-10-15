const express = require('express');
const router = express.Router();
const articulacionController = require('../controllers/articulacionController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const validar = require('../middlewares/validatorMiddleware');
const { createArticulacionSchema, updateArticulacionSchema } = require('../validators/articulacionSchema');

// Cualquier usuario autenticado
router.get('/dni/:dni', authenticate, articulacionController.getArticulacionesByDni);
router.get('/dni/:dni/ingreso/:id_ingreso', authenticate, articulacionController.getArticulacionesByDniAndIngreso);
router.get('/:id', authenticate, articulacionController.getArticulacionById);
router.post('/', authenticate, validar(createArticulacionSchema), articulacionController.createArticulacion);

// Solo administradores
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateArticulacionSchema), articulacionController.updateArticulacion);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), articulacionController.deleteArticulacion);

module.exports = router;
