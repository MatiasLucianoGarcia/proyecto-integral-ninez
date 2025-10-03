const parentezcoService = require('../services/parentezcoService');

const crearParentezco = async (req, res) => {
  try {
    const nuevoParentezco = await parentezcoService.crearParentezco(req.body.descripcion);
    res.status(201).json(nuevoParentezco);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear parentezco', error });
  }
};

const obtenerParentezcos = async (req, res) => {
  try {
    const parentezcos = await parentezcoService.obtenerParentezcos();
    res.json(parentezcos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener parentezcos', error });
  }
};

const actualizarParentezco = async (req, res) => {
  try {
    const parentezcoActualizado = await parentezcoService.actualizarParentezco(
      req.params.id,
      req.body.descripcion
    );
    res.json(parentezcoActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar parentezco', error });
  }
};

const eliminarParentezco = async (req, res) => {
  try {
    await parentezcoService.eliminarParentezco(req.params.id);
    res.json({ message: 'Parentezco eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar parentezco', error });
  }
};

module.exports = {
  crearParentezco,
  obtenerParentezcos,
  actualizarParentezco,
  eliminarParentezco,
};
