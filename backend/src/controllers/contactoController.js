const contactoService = require('../services/contactoService');
const historialService = require('../services/historialService');

// POST
const crearContacto = async (req, res) => {
  try {
    const nuevoContacto = await contactoService.crearContacto(
      req.body.dni,
      req.body.telefono,
    );

    // Armo la intervención con el usuario actual
    const intervencion = `El usuario ${req.user.nombre} añadio nueva informacion de contacto para esta persona`;

    // Agrego al historial
    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de contacto exitosa",
    });

    res.status(201).json(nuevoContacto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear Contacto', error });
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
