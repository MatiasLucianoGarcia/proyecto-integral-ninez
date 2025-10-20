const contactoService = require('../services/contactoService');
const historialService = require('../services/historialService');

// POST
const crearContacto = async (req, res) => {
  try {
    const nuevoContacto = await contactoService.crearContacto(
      req.body.dni,
      req.body.telefono
    );

    // Intervención para historial
    const intervencion = `El usuario ${req.user.nombre} añadió un nuevo contacto para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de contacto exitosa",
    });

    res.status(201).json(nuevoContacto);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al crear contacto' });
  }
};

// GET
const obtenerContactos = async (req, res) => {
  try {
    const dni = req.params.dni;
    const contactos = await contactoService.obtenerContactos(dni);
    res.status(200).json(contactos);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener contactos' });
  }
};

// DELETE
const eliminarContacto = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await contactoService.eliminarContacto(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al eliminar contacto' });
  }
};

// GET última
const obtenerUltimoContactoPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const contacto = await contactoService.obtenerUltimoContactoPorDni(dni);
    res.status(200).json(contacto);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener último contacto' });
  }
};

module.exports = {
  crearContacto,
  obtenerContactos,
  eliminarContacto,
  obtenerUltimoContactoPorDni,
};
