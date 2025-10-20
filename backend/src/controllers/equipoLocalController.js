const equipoLocalService = require('../services/equipoLocalService');

const crearEquipoLocal = async (req, res) => {
  try {
    const nuevo = await equipoLocalService.crearEquipoLocal(req.body.nombre);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error al crear equipo local' });
  }
};

const obtenerEquiposLocales = async (req, res) => {
  try {
    const equipos = await equipoLocalService.obtenerEquiposLocales();
    res.json(equipos);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error al obtener equipos locales' });
  }
};

const obtenerEquipoLocalPorId = async (req, res) => {
  try {
    const equipo = await equipoLocalService.obtenerEquipoLocalPorId(req.params.id);
    if (!equipo) {
      return res.status(404).json({ message: `El equipo local con ID ${req.params.id} no existe` });
    }
    res.json(equipo);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error al obtener equipo local' });
  }
};

const actualizarEquipoLocal = async (req, res) => {
  try {
    const actualizado = await equipoLocalService.actualizarEquipoLocal(req.params.id, req.body.nombre);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error al actualizar equipo local' });
  }
};

const eliminarEquipoLocal = async (req, res) => {
  try {
    const resultado = await equipoLocalService.eliminarEquipoLocal(req.params.id);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error al eliminar equipo local' });
  }
};

module.exports = {
  crearEquipoLocal,
  obtenerEquiposLocales,
  obtenerEquipoLocalPorId,
  actualizarEquipoLocal,
  eliminarEquipoLocal,
};
