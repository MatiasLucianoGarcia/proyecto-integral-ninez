const {
  crearHojaRuta,
  obtenerHojasRutaPorDni,
  obtenerHojasRutaPorServicioLocalId,
  obtenerHojaRutaPorId,
  actualizarHojaRuta,
  eliminarHojaRuta,
} = require('../services/hojaRutaService');

// Obtener todas por DNI
const getHojasRutaByDni = async (req, res) => {
  try {
    const { dni } = req.params;
    const hojas = await obtenerHojasRutaPorDni(dni);
    res.json(hojas);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Obtener todas por ID de servicio local
const getHojasRutaByServicioLocalId = async (req, res) => {
  try {
    const { id } = req.params;
    const hojas = await obtenerHojasRutaPorServicioLocalId(id);
    res.json(hojas);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Obtener hoja por ID
const getHojaRutaById = async (req, res) => {
  try {
    const { id } = req.params;
    const hoja = await obtenerHojaRutaPorId(id);
    res.json(hoja);
  } catch (error) {
    res.status(error.status || 404).json({ message: error.message });
  }
};

// Crear hoja de ruta
const createHojaRuta = async (req, res) => {
  try {
    const hoja = await crearHojaRuta(req.body);
    res.status(201).json(hoja);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Actualizar hoja de ruta (parcial)
const updateHojaRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const hojaActualizada = await actualizarHojaRuta(id, req.body);
    res.json(hojaActualizada);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

// Eliminar hoja de ruta
const deleteHojaRuta = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarHojaRuta(id);
    res.json({ message: 'Hoja de ruta eliminada correctamente' });
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

module.exports = {
  getHojasRutaByDni,
  getHojasRutaByServicioLocalId,
  getHojaRutaById,
  createHojaRuta,
  updateHojaRuta,
  deleteHojaRuta,
};
