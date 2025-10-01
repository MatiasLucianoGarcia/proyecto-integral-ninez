const escolaridadService = require('../services/escolaridadService');
const historialService = require('../services/historialService');

// POST
const crearEscolaridad = async (req, res) => {
  try {
    const nuevaEscolaridad = await escolaridadService.crearEscolaridad(
      req.body.dni,
      req.body.escuela,
      req.body.nivel,
      req.body.año,
    );

    // Intervención
    const intervencion = `El usuario ${req.user.nombre} añadió información de escolaridad para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de escolaridad exitosa",
    });

    res.status(201).json(nuevaEscolaridad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear escolaridad', error });
  }
};

// GET
const obtenerEscolaridades = async (req, res) => {
  try {
    const dni = req.params.dni;
    const escolaridades = await escolaridadService.obtenerEscolaridades(dni);
    res.json(escolaridades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener escolaridades', error });
  }
};

// DELETE
const eliminarEscolaridad = async (req, res) => {
  try {
    const id = req.params.id;
    await escolaridadService.eliminarEscolaridad(id);
    res.json({ message: 'Escolaridad eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar escolaridad', error });
  }
};

// GET último registro
const obtenerUltimaEscolaridadPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const escolaridad = await escolaridadService.obtenerUltimaEscolaridadPorDni(dni);
    res.json(escolaridad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener última escolaridad', error });
  }
};

module.exports = {
  crearEscolaridad,
  obtenerEscolaridades,
  eliminarEscolaridad,
  obtenerUltimaEscolaridadPorDni
};
