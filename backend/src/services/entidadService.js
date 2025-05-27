const supabase = require('../config/db');

const getEntidades = async () => {
  const { data, error } = await supabase.from('entidad').select('*');
  if (error) throw error;
  return data;
};

const createEntidad = async ({ nombre, servicio_local, descripcion }) => {
  const { data, error } = await supabase
    .from('entidad')
    .insert([{ nombre, servicio_local, descripcion }])
    .select();

  if (error) throw error;
  return data[0];
};

const updateEntidad = async (id, { nombre, servicio_local, descripcion }) => {
  const { data, error } = await supabase
    .from('entidad')
    .update({ nombre, servicio_local, descripcion })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

const deleteEntidad = async (id) => {
  const { error } = await supabase.from('entidad').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  getEntidades,
  createEntidad,
  updateEntidad,
  deleteEntidad,
};
