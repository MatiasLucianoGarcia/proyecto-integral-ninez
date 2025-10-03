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
    const intervencion = `El usuario ${req.user.nombre} añadió nueva información de contacto para esta persona`;

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
const obtenerContactos= async (req, res) => {
  try {
    const dni = req.params.dni;
    const contactos = await contactoService.obtenerContactos(dni);
    res.json(contactos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener contactos', error });
  }
};

// DELETE
const eliminarContacto = async (req, res) => {
  try {
    const id = req.params.id;
    await contactoService.eliminarContacto(id);
    res.json({ message: 'Contacto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar Contacto', error });
  }
};

const obtenerUltimoContactoPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const contacto = await contactoService.obtenerUltimoContactoPorDni(dni);
    res.json(contacto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener último contacto', error });
  }
};

module.exports = {
  crearContacto,
  obtenerContactos,
  eliminarContacto,
  obtenerUltimoContactoPorDni
};
