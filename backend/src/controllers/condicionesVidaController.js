const condicionesVidaService = require('../services/condicionesVidaService');
const historialService = require('../services/historialService');

const obtenerCondicionesVida = async (req, res) => {
  try {
    const dni = req.params.dni;
    const condiciones = await condicionesVidaService.obtenerCondicionesVida(dni);
    res.json(condiciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener condiciones de vida', error });
  }
};

const actualizarCondicionesVida = async (req, res) => {
  try {
    const dni = req.params.dni;
    const actualizadas = await condicionesVidaService.actualizarCondicionesVida(dni, req.body);

    const intervencion = `El usuario ${req.user.nombre} actualizó la información de condiciones de vida de esta persona`;

    await historialService.createHistorial({
      dni,
      intervencion,
      resultado: "Actualización de condición de vida exitosa",
      fecha_carga: new Date(),
    });

    res.json(actualizadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar condiciones de vida', error });
  }
};

module.exports = {
  obtenerCondicionesVida,
  actualizarCondicionesVida,
};
