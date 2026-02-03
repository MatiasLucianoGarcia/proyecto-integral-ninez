const trabajoService = require('../services/trabajoService');
const historialService = require('../services/historialService');

// POST - Crear trabajo
const crearTrabajo = async (req, res) => {
  try {
    const nuevoTrabajo = await trabajoService.crearTrabajo(
      req.body.dni,
      req.body.descripcion,
      req.body.horario,
      req.body.fecha_real
    );

    const intervencion = `El usuario ${req.user.nombre} añadió nueva información laboral para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de trabajo exitosa",
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevoTrabajo);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al crear trabajo',
    });
  }
};

// GET - Obtener trabajos por DNI
const obtenerTrabajos = async (req, res) => {
  try {
    const dni = req.params.dni;
    const trabajos = await trabajoService.obtenerTrabajos(dni);
    res.json(trabajos);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener trabajos',
    });
  }
};

// DELETE - Eliminar trabajo por ID
const eliminarTrabajo = async (req, res) => {
  try {
    const id = req.params.id;
    await trabajoService.eliminarTrabajo(id);
    res.json({ message: 'Trabajo eliminado' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar trabajo',
    });
  }
};

// GET - Obtener último trabajo por DNI
const obtenerUltimoTrabajoPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const trabajo = await trabajoService.obtenerUltimoTrabajoPorDni(dni);
    res.json(trabajo);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener último trabajo',
    });
  }
};

module.exports = {
  crearTrabajo,
  obtenerTrabajos,
  eliminarTrabajo,
  obtenerUltimoTrabajoPorDni,
};
