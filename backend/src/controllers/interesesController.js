const interesesService = require('../services/interesesService');
const historialService = require('../services/historialService');

const obtenerIntereses = async (req, res) => {
  try {
    const dni = req.params.dni;
    const intereses = await interesesService.obtenerIntereses(dni);
    res.json(intereses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener intereses', error });
  }
};

const actualizarIntereses = async (req, res) => {
  try {
    const dni = req.params.dni;
    const actualizados = await interesesService.actualizarIntereses(dni, req.body);

    const intervencion = `El usuario ${req.user.nombre} actualizó la información de intereses de esta persona`;

    await historialService.createHistorial({
      dni,
      intervencion,
      resultado: "Actualización de intereses exitosa",
      fecha_carga: new Date(),
    });

    res.json(actualizados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar intereses', error });
  }
};

module.exports = {
  obtenerIntereses,
  actualizarIntereses,
};
