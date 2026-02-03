const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// GET /api/reportes/escolaridad?anio=2024
router.get('/escolaridad', reportesController.obtenerReporteEscolaridad);
router.get('/escolaridad/anios', reportesController.obtenerAniosDisponibles);

module.exports = router;
