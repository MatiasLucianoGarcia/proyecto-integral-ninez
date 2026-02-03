const reportesService = require('../services/reportesService');

const getReporteEscolaridad = async (req, res) => {
    try {
        // Si no viene año, usamos el actual
        const anio = req.query.anio || new Date().getFullYear();
        // Filtros de edad opcionales (defaults manejados en servicio)
        const minEdad = req.query.minEdad;
        const maxEdad = req.query.maxEdad;

        const reporte = await reportesService.obtenerReporteEscolaridad(anio, minEdad, maxEdad);

        res.json({
            anio: parseInt(anio, 10),
            minEdad: minEdad ? parseInt(minEdad, 10) : 5, // Solo para feedback, service usa su default
            maxEdad: maxEdad ? parseInt(maxEdad, 10) : 21,
            data: reporte
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || 'Error al obtener reporte de escolaridad'
        });
    }
};

const getAniosDisponibles = async (req, res) => {
    try {
        const anios = await reportesService.obtenerAniosDisponibles();
        res.json(anios);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || 'Error al obtener años disponibles'
        });
    }
};

const getReporteCondicionesVida = async (req, res) => {
    try {
        const { minEdad, maxEdad } = req.query;
        const reporte = await reportesService.obtenerReporteCondicionesVida({
            minEdad: minEdad ? parseInt(minEdad) : undefined,
            maxEdad: maxEdad ? parseInt(maxEdad) : undefined
        });
        res.json({ data: reporte });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getReporteEscolaridad,
    getAniosDisponibles,
    getReporteCondicionesVida
};
