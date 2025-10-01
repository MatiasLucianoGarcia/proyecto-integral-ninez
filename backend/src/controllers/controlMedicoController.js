const controlMedicoService = require('../services/controlMedicoService');
const historialService = require('../services/historialService');

// POST
const crearControlMedico = async (req, res) => {
  try {
    const nuevoControl = await controlMedicoService.crearControlMedico(
      req.body.dni,
      req.body.unidad_sanitaria,
      req.body.observaciones
    );

    // Intervención
    const intervencion = `El usuario ${req.user.nombre} añadió un control médico para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: "Alta de control médico exitosa",
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevoControl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear control médico', error });
  }
};

// GET
const obtenerControlesMedicos = async (req, res) => {
  try {
    const dni = req.params.dni;
    const controles = await controlMedicoService.obtenerControlesMedicos(dni);
    res.json(controles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener controles médicos', error });
  }
};

// DELETE
const eliminarControlMedico = async (req, res) => {
  try {
    const id = req.params.id;
    await controlMedicoService.eliminarControlMedico(id);
    res.json({ message: 'Control médico eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar control médico', error });
  }
};

// GET último registro
const obtenerUltimoControlMedicoPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const control = await controlMedicoService.obtenerUltimoControlMedicoPorDni(dni);
    res.json(control);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener último control médico', error });
  }
};

module.exports = {
  crearControlMedico,
  obtenerControlesMedicos,
  eliminarControlMedico,
  obtenerUltimoControlMedicoPorDni
};
