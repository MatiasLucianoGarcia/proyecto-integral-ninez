const familiaService = require('../services/familiaService');
const historialService = require('../services/historialService');

// Consultar familia por DNI
const obtenerFamiliaPorDni = async (req, res) => {
  try {
    const dni = Number(req.params.dni);
    const familia = await familiaService.obtenerFamiliaPorDni(dni);
    res.json(familia);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener familia',
    });
  }
};

// Crear familia (sin tocar, ya andaba bien)
const crearFamilia = async (req, res) => {
  try {
    const nuevaFamilia = await familiaService.crearFamilia(req.body);

    const intervencion = `El usuario ${req.user.nombre} añadió un nuevo familiar para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni_p1,
      intervencion,
      resultado: "Alta de relación familiar exitosa",
      fecha_carga: new Date(),
    });

    await historialService.createHistorial({
      dni: req.body.dni_p2,
      intervencion,
      resultado: "Alta de relación familiar exitosa",
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevaFamilia);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al crear familia",
    });
  }
};

// Actualizar familia
const actualizarFamilia = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const familiaActualizada = await familiaService.actualizarFamilia(id, req.body);
    res.json(familiaActualizada);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al actualizar familia',
    });
  }
};

// Eliminar familia
const eliminarFamilia = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const resultado = await familiaService.eliminarFamilia(id);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar familia',
    });
  }
};

// Sugerir familia
const sugerirFamilia = async (req, res) => {
  try {
    const dni = Number(req.params.dni);
    const sugerencias = await familiaService.sugerirFamilia(dni);
    res.json(sugerencias);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al sugerir familia",
    });
  }
};

module.exports = {
  obtenerFamiliaPorDni,
  crearFamilia,
  actualizarFamilia,
  eliminarFamilia,
  sugerirFamilia,
};
