const reportesService = require('../services/reportesService');

const getReporteEscolaridad = async (req, res) => {
    try {
        // Si no viene año, usamos el actual
        const anio = req.query.anio || new Date().getFullYear();
        // Filtros de edad opcionales (defaults manejados en servicio)
        const minEdad = req.query.minEdad;
        const maxEdad = req.query.maxEdad;

        let generos = req.query.generos ? (Array.isArray(req.query.generos) ? req.query.generos : Object.values(req.query.generos)) : [];
        let nacionalidades = req.query.nacionalidades ? (Array.isArray(req.query.nacionalidades) ? req.query.nacionalidades : Object.values(req.query.nacionalidades)) : [];

        // Handle stringified arrays if passed as "Masculino,Femenino" or single string
        if (typeof req.query.generos === 'string') generos = req.query.generos.split(',');
        if (typeof req.query.nacionalidades === 'string') nacionalidades = req.query.nacionalidades.split(',');

        const reporte = await reportesService.obtenerReporteEscolaridad(anio, minEdad, maxEdad, generos, nacionalidades);

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

        let generos = req.query.generos ? (Array.isArray(req.query.generos) ? req.query.generos : Object.values(req.query.generos)) : [];
        let nacionalidades = req.query.nacionalidades ? (Array.isArray(req.query.nacionalidades) ? req.query.nacionalidades : Object.values(req.query.nacionalidades)) : [];

        // Handle stringified arrays if passed as "Masculino,Femenino" or single string
        if (typeof req.query.generos === 'string') generos = req.query.generos.split(',');
        if (typeof req.query.nacionalidades === 'string') nacionalidades = req.query.nacionalidades.split(',');

        const reporte = await reportesService.obtenerReporteCondicionesVida({
            minEdad: minEdad ? parseInt(minEdad) : undefined,
            maxEdad: maxEdad ? parseInt(maxEdad) : undefined,
            generos,
            nacionalidades
        });
        res.json({ data: reporte });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getReporteDetalle = async (req, res) => {
    try {
        const { tipo, anio, filtros } = req.body;

        if (!tipo) {
            return res.status(400).json({ message: 'El tipo de reporte es requerido' });
        }

        const detalle = await reportesService.obtenerDetallePersonas({ tipo, anio, filtros });
        res.json(detalle);
    } catch (error) {
        console.error('Error obteniendo detalle:', error);
        res.status(500).json({ message: error.message || 'Error interno al obtener detalle' });
    }
};

// --- REPORTE DERECHOS VULNERADOS ---
const getReporteDerechosVulnerados = async (req, res, next) => {
    try {
        const anio = req.query.anio || new Date().getFullYear();
        const minEdad = req.query.minEdad;
        const maxEdad = req.query.maxEdad;

        let generos = req.query.generos ? (Array.isArray(req.query.generos) ? req.query.generos : Object.values(req.query.generos)) : [];
        let nacionalidades = req.query.nacionalidades ? (Array.isArray(req.query.nacionalidades) ? req.query.nacionalidades : Object.values(req.query.nacionalidades)) : [];

        if (typeof req.query.generos === 'string') generos = req.query.generos.split(',');
        if (typeof req.query.nacionalidades === 'string') nacionalidades = req.query.nacionalidades.split(',');

        const reporte = await reportesService.obtenerReporteDerechosVulnerados({ anio, minEdad, maxEdad, generos, nacionalidades });

        res.json({
            anio: parseInt(anio, 10),
            minEdad: minEdad ? parseInt(minEdad, 10) : 0,
            maxEdad: maxEdad ? parseInt(maxEdad, 10) : 100,
            data: reporte
        });
    } catch (error) {
        next(error);
    }
};

const getAniosDerechosVulnerados = async (req, res, next) => {
    try {
        const anios = await reportesService.obtenerAniosDerechosVulnerados();
        res.json(anios);
    } catch (error) {
        next(error);
    }
};

const getAlertas = async (req, res) => {
    try {
        const { minEdad, maxEdad } = req.query;
        const alertas = await reportesService.obtenerAlertas({
            minEdad: minEdad ? parseInt(minEdad) : undefined,
            maxEdad: maxEdad ? parseInt(maxEdad) : undefined
        });
        res.json(alertas);
    } catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ message: error.message || 'Error al obtener alertas' });
    }
};

module.exports = {
    getReporteEscolaridad,
    getAniosDisponibles,
    getReporteCondicionesVida,
    getReporteDetalle,
    getReporteDerechosVulnerados,
    getAniosDerechosVulnerados,
    getAlertas
};
