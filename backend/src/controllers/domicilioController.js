const domicilioService = require('../services/domicilioService');
const historialService = require('../services/historialService');

// POST
const crearDomicilio = async (req, res) => {
  try {
    const nuevoDomicilio = await domicilioService.crearDomicilio(
      req.body.dni,
      req.body.nombre,
      req.body.numero,
    );

    // Intervención con el usuario actual
    const intervencion = `El usuario ${req.user.nombre} añadió nueva información de domicilio para esta persona`;

    // Guardar en historial
    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de domicilio exitosa",
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevoDomicilio);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al crear domicilio' });
  }
};

// GET
const obtenerDomicilios = async (req, res) => {
  try {
    const dni = req.params.dni;
    const domicilios = await domicilioService.obtenerDomicilios(dni);
    res.json(domicilios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener domicilios', error });
  }
};

// DELETE
const eliminarDomicilio = async (req, res) => {
  try {
    const id = req.params.id;
    await domicilioService.eliminarDomicilio(id);
    res.json({ message: 'Domicilio eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar domicilio', error });
  }
};

const obtenerUltimoDomicilioPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const domicilio = await domicilioService.obtenerUltimoDomicilioPorDni(dni);
    res.json(domicilio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener último domicilio', error });
  }
};

module.exports = {
  crearDomicilio,
  obtenerDomicilios,
  eliminarDomicilio,
  obtenerUltimoDomicilioPorDni
};
