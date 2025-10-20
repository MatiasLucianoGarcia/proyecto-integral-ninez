const viviendaService = require('../services/viviendaService');
const historialService = require('../services/historialService');

// POST - Crear vivienda
const crearVivienda = async (req, res) => {
  try {
    const nuevaVivienda = await viviendaService.crearVivienda(
      req.body.dni,
      req.body.tipo_vivienda,
      req.body.observaciones
    );

    const intervencion = `El usuario ${req.user.nombre} añadió una nueva vivienda para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de vivienda exitosa",
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevaVivienda);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al crear vivienda" });
  }
};

// GET - Obtener viviendas por DNI
const obtenerViviendas = async (req, res) => {
  try {
    const dni = req.params.dni;
    const viviendas = await viviendaService.obtenerViviendas(dni);
    res.json(viviendas);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al obtener viviendas" });
  }
};

// DELETE - Eliminar vivienda
const eliminarVivienda = async (req, res) => {
  try {
    const id = req.params.id;
    await viviendaService.eliminarVivienda(id);
    res.json({ message: 'Vivienda eliminada' });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al eliminar vivienda" });
  }
};

// GET - Última vivienda por DNI
const obtenerUltimaViviendaPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const vivienda = await viviendaService.obtenerUltimaViviendaPorDni(dni);
    res.json(vivienda);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Error al obtener última vivienda" });
  }
};

module.exports = {
  crearVivienda,
  obtenerViviendas,
  eliminarVivienda,
  obtenerUltimaViviendaPorDni
};
