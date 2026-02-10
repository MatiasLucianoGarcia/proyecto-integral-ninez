const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// GET /api/reportes/escolaridad?anio=2024
// GET /api/reportes/escolaridad?anio=2024
router.get('/escolaridad', reportesController.getReporteEscolaridad); // Updated to match controller rename if happened, or check alias
router.get('/escolaridad/anios', reportesController.getAniosDisponibles);
router.get('/condiciones-vida', reportesController.getReporteCondicionesVida);
router.post('/detalle', reportesController.getReporteDetalle);
router.get('/derechos-vulnerados', reportesController.getReporteDerechosVulnerados);
router.get('/derechos-vulnerados/anios', reportesController.getAniosDerechosVulnerados);
router.get('/alertas', reportesController.getAlertas);

module.exports = router;
