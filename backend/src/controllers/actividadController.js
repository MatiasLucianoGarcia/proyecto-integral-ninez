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
    res.status(500).json({ message: 'Error al crear actividad', error });
  }
};

// GET
const obtenerActividades = async (req, res) => {
  try {
    const dni = req.params.dni;
    const actividades = await actividadService.obtenerActividades(dni);
    res.json(actividades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener actividades', error });
  }
};

// DELETE
const eliminarActividad = async (req, res) => {
  try {
    const id = req.params.id;
    await actividadService.eliminarActividad(id);
    res.json({ message: 'Actividad eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar actividad', error });
  }
};

// GET última
const obtenerUltimaActividadPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const actividad = await actividadService.obtenerUltimaActividadPorDni(dni);
    res.json(actividad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener última actividad', error });
  }
};

module.exports = {
  crearActividad,
  obtenerActividades,
  eliminarActividad,
  obtenerUltimaActividadPorDni
};
