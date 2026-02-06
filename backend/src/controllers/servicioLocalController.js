const {
  crearServicioLocal,
  obtenerServiciosLocales,
  obtenerServicioLocalPorId,
  actualizarServicioLocal,
  eliminarServicioLocal,
  obtenerServiciosLocalesPorDni,
} = require('../services/servicioLocalService');

// Obtener todos
const getAllServicioLocal = async (req, res) => {
  try {
    const servicios = await obtenerServiciosLocales();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los servicios locales', error });
  }
};

// Obtener por ID
const getServicioLocalById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await obtenerServicioLocalPorId(id);
    if (!servicio) return res.status(404).json({ message: `El servicio local con id ${id} no existe` });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener servicio local', error });
  }
};

// Crear
const createServicioLocal = async (req, res) => {
  try {
    const nuevoServicio = await crearServicioLocal(req.body);
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message || 'Error al crear servicio local' });
  }
};

// Actualizar
const updateServicioLocal = async (req, res) => {
  try {
    const { id } = req.params;
    const servicioActualizado = await actualizarServicioLocal(id, req.body);
    if (!servicioActualizado) return res.status(404).json({ message: `El servicio local con id ${id} no existe` });
    res.json(servicioActualizado);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message || 'Error al actualizar servicio local' });
  }
};

// Eliminar
const deleteServicioLocal = async (req, res) => {
  try {
    const { id } = req.params;
    const servicioEliminado = await eliminarServicioLocal(id);
    if (!servicioEliminado) return res.status(404).json({ message: `El servicio local con id ${id} no existe` });
    res.json({ message: 'Servicio local eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar servicio local', error });
  }
};

// Obtener por DNI
// Obtener por DNI (con lógica de permisos)
const getServiciosLocalesByDni = async (req, res) => {
  try {
    const { dni } = req.params;
    const userRole = req.user.rol; // Asumimos string, e.g. "Administrador"

    // Roles privilegiados ven todo el detalle
    if (['Administrador', 'Proteccion'].includes(userRole)) {
      const servicios = await obtenerServiciosLocalesPorDni(dni);
      return res.json(servicios);
    }

    // Otros roles ven solo el estado
    const estado = await require('../services/servicioLocalService').obtenerEstadoIntervencion(dni);
    res.json(estado);

  } catch (error) {
    res.status(error.status || 400).json({ message: error.message || 'Error al obtener servicios locales por DNI' });
  }
};

module.exports = {
  getAllServicioLocal,
  getServicioLocalById,
  createServicioLocal,
  updateServicioLocal,
  deleteServicioLocal,
  getServiciosLocalesByDni,
};
