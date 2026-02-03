const escolaridadService = require('../services/escolaridadService');
const historialService = require('../services/historialService');

// POST
const crearEscolaridad = async (req, res) => {
  try {
    const nuevaEscolaridad = await escolaridadService.crearEscolaridad(
      req.body.dni,
      req.body.escuela,
      req.body.nivel,
      req.body.anio,
      req.body.fecha_real
    );

    const intervencion = `El usuario ${req.user.nombre} añadió nueva información de escolaridad para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: 'Alta de escolaridad exitosa',
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevaEscolaridad);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al crear escolaridad',
    });
  }
};

// GET todas por DNI
const obtenerEscolaridades = async (req, res) => {
  try {
    const dni = req.params.dni;
    const escolaridades = await escolaridadService.obtenerEscolaridades(dni);
    res.json(escolaridades);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener escolaridades',
    });
  }
};

// DELETE por ID
const eliminarEscolaridad = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await escolaridadService.eliminarEscolaridad(id);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar escolaridad',
    });
  }
};

// GET última escolaridad por DNI
const obtenerUltimaEscolaridadPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const escolaridad = await escolaridadService.obtenerUltimaEscolaridadPorDni(dni);

    // Si existe la persona pero no tiene registros, devuelve null (como está bien)
    res.json(escolaridad || {});
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener última escolaridad',
    });
  }
};

module.exports = {
  crearEscolaridad,
  obtenerEscolaridades,
  eliminarEscolaridad,
  obtenerUltimaEscolaridadPorDni,
};
