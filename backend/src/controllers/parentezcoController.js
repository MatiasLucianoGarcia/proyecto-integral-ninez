const parentezcoService = require('../services/parentezcoService');

const crearParentezco = async (req, res) => {
  try {
    const { descripcion, id_inverso } = req.body;
    const nuevoParentezco = await parentezcoService.crearParentezco(descripcion, id_inverso);
    res.status(201).json(nuevoParentezco);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Error al crear parentezco' });
  }
};

const obtenerParentezcos = async (req, res) => {
  try {
    const parentezcos = await parentezcoService.obtenerParentezcos();
    res.json(parentezcos);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Error al obtener parentezcos' });
  }
};

const actualizarParentezco = async (req, res) => {
  try {
    const { descripcion, id_inverso } = req.body;
    const parentezcoActualizado = await parentezcoService.actualizarParentezco(
      req.params.id,
      descripcion,
      id_inverso
    );
    res.json(parentezcoActualizado);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Error al actualizar parentezco' });
  }
};

const eliminarParentezco = async (req, res) => {
  try {
    const resultado = await parentezcoService.eliminarParentezco(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Error al eliminar parentezco' });
  }
};

module.exports = {
  crearParentezco,
  obtenerParentezcos,
  actualizarParentezco,
  eliminarParentezco,
};
