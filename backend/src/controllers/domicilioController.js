const domicilioService = require('../services/domicilioService');
const historialService = require('../services/historialService');

// POST - Crear domicilio
const crearDomicilio = async (req, res) => {
  try {
    const nuevoDomicilio = await domicilioService.crearDomicilio(
      req.body.dni,
      req.body.nombre,
      req.body.numero,
      req.body.fecha_real
    );

    const intervencion = `El usuario ${req.user.nombre} añadió un nuevo domicilio para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de domicilio exitosa",
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevoDomicilio);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al crear domicilio',
    });
  }
};

// GET - Obtener domicilios por DNI
const obtenerDomicilios = async (req, res) => {
  try {
    const dni = req.params.dni;
    const domicilios = await domicilioService.obtenerDomicilios(dni);
    res.status(200).json(domicilios);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener domicilios',
    });
  }
};

// DELETE - Eliminar domicilio por ID
const eliminarDomicilio = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await domicilioService.eliminarDomicilio(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al eliminar domicilio',
    });
  }
};

// GET - Obtener el último domicilio por DNI
const obtenerUltimoDomicilioPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const domicilio = await domicilioService.obtenerUltimoDomicilioPorDni(dni);
    res.status(200).json(domicilio || {});
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || 'Error al obtener último domicilio',
    });
  }
};

module.exports = {
  crearDomicilio,
  obtenerDomicilios,
  eliminarDomicilio,
  obtenerUltimoDomicilioPorDni,
};
