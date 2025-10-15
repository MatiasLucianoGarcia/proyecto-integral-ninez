const saludService = require('../services/saludService');
const historialService = require('../services/historialService');

const obtenerSalud = async (req, res) => {
  try {
    const dni = req.params.dni;
    const salud = await saludService.obtenerSalud(dni);
    res.json(salud);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener salud', error });
  }
};

const actualizarSalud = async (req, res) => {
  try {
    const dni = req.params.dni;
    const actualizada = await saludService.actualizarSalud(dni, req.body);

    const intervencion = `El usuario ${req.user.nombre} actualizó la información de salud de esta persona`;

    await historialService.createHistorial({
      dni,
      intervencion,
      resultado: "Actualización de salud exitosa",
      fecha_carga: new Date(),
    });

    res.json(actualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar salud', error });
  }
};

module.exports = {
  obtenerSalud,
  actualizarSalud,
};
