const viviendaService = require('../services/viviendaService');
const historialService = require('../services/historialService');

// POST
const crearVivienda = async (req, res) => {
  try {
    const nuevaVivienda = await viviendaService.crearVivienda(
      req.body.dni,
      req.body.tipo_vivienda,
      req.body.observaciones
    );

    // Intervención
    const intervencion = `El usuario ${req.user.nombre} añadió información de vivienda para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de vivienda exitosa",
    });

    res.status(201).json(nuevaVivienda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear vivienda', error });
  }
};

// GET
const obtenerViviendas = async (req, res) => {
  try {
    const dni = req.params.dni;
    const viviendas = await viviendaService.obtenerViviendas(dni);
    res.json(viviendas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener viviendas', error });
  }
};

// DELETE
const eliminarVivienda = async (req, res) => {
  try {
    const id = req.params.id;
    await viviendaService.eliminarVivienda(id);
    res.json({ message: 'Vivienda eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar vivienda', error });
  }
};

// GET último registro
const obtenerUltimaViviendaPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const vivienda = await viviendaService.obtenerUltimaViviendaPorDni(dni);
    res.json(vivienda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener última vivienda', error });
  }
};

module.exports = {
  crearVivienda,
  obtenerViviendas,
  eliminarVivienda,
  obtenerUltimaViviendaPorDni
};
