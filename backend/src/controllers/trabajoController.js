const trabajoService = require('../services/trabajoService');
const historialService = require('../services/historialService');

// POST
const crearTrabajo = async (req, res) => {
  try {
    const nuevoTrabajo = await trabajoService.crearTrabajo(
      req.body.dni,
      req.body.descripcion,
      req.body.horario
    );

    // Intervención con usuario actual
    const intervencion = `El usuario ${req.user.nombre} añadió información laboral para esta persona`;

    // Guardar en historial
    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de trabajo exitosa",
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevoTrabajo);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al crear trabajo' });
  }
};

// GET
const obtenerTrabajos = async (req, res) => {
  try {
    const dni = req.params.dni;
    const trabajos = await trabajoService.obtenerTrabajos(dni);
    res.json(trabajos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener trabajos', error });
  }
};

// DELETE
const eliminarTrabajo = async (req, res) => {
  try {
    const id = req.params.id;
    await trabajoService.eliminarTrabajo(id);
    res.json({ message: 'Trabajo eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar trabajo', error });
  }
};

// GET último
const obtenerUltimoTrabajoPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const trabajo = await trabajoService.obtenerUltimoTrabajoPorDni(dni);
    res.json(trabajo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener último trabajo', error });
  }
};

module.exports = {
  crearTrabajo,
  obtenerTrabajos,
  eliminarTrabajo,
  obtenerUltimoTrabajoPorDni
};
