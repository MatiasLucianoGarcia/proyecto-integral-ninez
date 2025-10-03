const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const familiaController = require('../controllers/familiaController');
const validar = require('../middlewares/validatorMiddleware');
const { createFamiliaSchema, updateFamiliaSchema } = require('../validators/familiaSchema');

router.get('/:dni', authenticate, familiaController.obtenerFamiliaPorDni);
router.post('/', authenticate, authorizeRoles('Administrador'), validar(createFamiliaSchema), familiaController.crearFamilia);
router.put('/:id', authenticate, authorizeRoles('Administrador'), validar(updateFamiliaSchema), familiaController.actualizarFamilia);
router.delete('/:id', authenticate, authorizeRoles('Administrador'), familiaController.eliminarFamilia);

module.exports = router;
