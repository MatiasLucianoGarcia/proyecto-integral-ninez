const supabase = require('../config/db');

const getEntidades = async (req, res) => {
  const { data, error } = await supabase.from('entidad').select('*');
  if (error) return res.status(500).json({ message: 'Error al obtener entidades', error });
  res.json(data);
};

const createEntidad = async (req, res) => {
  const { nombre, servicio_local, descripcion } = req.body;
  const { data, error } = await supabase.from('entidad').insert([{ nombre, servicio_local, descripcion }]).select();
  if (error) return res.status(500).json({ message: 'Error al crear entidad', error });
  res.status(201).json(data[0]);
};

const updateEntidad = async (req, res) => {
  const { id } = req.params;
  const { nombre, servicio_local, descripcion } = req.body;
  const { data, error } = await supabase
    .from('entidad')
    .update({ nombre, servicio_local, descripcion })
    .eq('id', id)
    .select();;
  if (error) return res.status(500).json({ message: 'Error al actualizar entidad', error });
  res.json(data[0]);
};

const deleteEntidad = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('entidad').delete().eq('id', id);
  if (error) return res.status(500).json({ message: 'Error al eliminar entidad', error });
  res.json({ message: 'Entidad eliminado' });
};

module.exports = {
  getEntidades,
  createEntidad,
  updateEntidad,
  deleteEntidad,
};
