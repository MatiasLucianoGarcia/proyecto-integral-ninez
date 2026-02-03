const controlMedicoService = require('../services/controlMedicoService');
const historialService = require('../services/historialService');

// Crear control médico
const crearControlMedico = async (req, res) => {
  try {
    const nuevoControl = await controlMedicoService.crearControlMedico(
      req.body.dni,
      req.body.unidad_sanitaria,
      req.body.observaciones,
      req.body.fecha_real
    );

    // Registrar en historial
    const intervencion = `El usuario ${req.user.nombre} añadió un nuevo control médico para esta persona`;

    await historialService.createHistorial({
      dni: req.body.dni,
      intervencion,
      resultado: 'Alta de control médico exitosa',
      fecha_carga: new Date(),
    });

    res.status(201).json(nuevoControl);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al crear control médico' });
  }
};

// Obtener controles por DNI
const obtenerControlesMedicos = async (req, res) => {
  try {
    const dni = req.params.dni;
    const controles = await controlMedicoService.obtenerControlesMedicos(dni);
    res.status(200).json(controles);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener controles médicos' });
  }
};

// Eliminar control médico por ID
const eliminarControlMedico = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await controlMedicoService.eliminarControlMedico(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al eliminar control médico' });
  }
};

// Obtener último control médico por DNI
const obtenerUltimoControlMedicoPorDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const control = await controlMedicoService.obtenerUltimoControlMedicoPorDni(dni);
    res.status(200).json(control);
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Error al obtener último control médico' });
  }
};

module.exports = {
  crearControlMedico,
  obtenerControlesMedicos,
  eliminarControlMedico,
  obtenerUltimoControlMedicoPorDni,
};
