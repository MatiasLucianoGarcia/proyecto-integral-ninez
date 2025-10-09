const equipoLocalService = require('../services/equipoLocalService');

const crearEquipoLocal = async (req, res) => {
  try {
    const nuevo = await equipoLocalService.crearEquipoLocal(req.body.nombre);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear equipo local', error });
  }
};

const obtenerEquiposLocales = async (req, res) => {
  try {
    const equipos = await equipoLocalService.obtenerEquiposLocales();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener equipos locales', error });
  }
};

const obtenerEquipoLocalPorId = async (req, res) => {
  try {
    const equipo = await equipoLocalService.obtenerEquipoLocalPorId(req.params.id);
    if (!equipo) {
      return res.status(404).json({ message: 'El equipo local con ese ID no existe' });
    }
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener equipo local', error });
  }
};

const actualizarEquipoLocal = async (req, res) => {
  try {
    const actualizado = await equipoLocalService.actualizarEquipoLocal(req.params.id, req.body.nombre);
    if (!actualizado) {
      return res.status(404).json({ message: 'El equipo local con ese ID no existe' });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar equipo local', error });
  }
};

const eliminarEquipoLocal = async (req, res) => {
  try {
    await equipoLocalService.eliminarEquipoLocal(req.params.id);
    res.json({ message: 'Equipo local eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar equipo local', error });
  }
};

module.exports = {
  crearEquipoLocal,
  obtenerEquiposLocales,
  obtenerEquipoLocalPorId,
  actualizarEquipoLocal,
  eliminarEquipoLocal,
};
