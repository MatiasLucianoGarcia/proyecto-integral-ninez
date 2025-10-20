const actividadService = require('../services/actividadService');
const historialService = require('../services/historialService');

// POST
const crearActividad = async (req, res) => {
  try {
    const nuevaActividad = await actividadService.crearActividad(
      req.body.dni,
      req.body.actividad,
      req.body.horario,
      req.body.observaciones
    );

    const intervencion = `El usuario ${req.user.nombre} añadió una actividad para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de actividad exitosa",
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevaActividad);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al crear actividad" });
  }
};

// GET
const obtenerActividades = async (req, res) => {
  try {
    const dni = req.params.dni;
    const actividades = await actividadService.obtenerActividades(dni);
    res.status(200).json(actividades);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al obtener actividades" });
  }
};

// DELETE
const eliminarActividad = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await actividadService.eliminarActividad(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al eliminar actividad" });
  }
};

// GET última
const obtenerUltimaActividadPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const actividad = await actividadService.obtenerUltimaActividadPorDni(dni);
    res.status(200).json(actividad);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al obtener última actividad" });
  }
};

module.exports = {
  crearActividad,
  obtenerActividades,
  eliminarActividad,
  obtenerUltimaActividadPorDni,
};
