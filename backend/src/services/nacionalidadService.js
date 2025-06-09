const supabase = require('../config/db');

const getNacionalidades = async () => {
  const { data, error } = await supabase.from('nacionalidad').select('*');
  if (error) throw new Error('Error al obtener nacionalidades');
  return data;
};

const createNacionalidad = async (nombre) => {
  const { data, error } = await supabase
    .from('nacionalidad')
    .insert([{ nombre }])
    .select();

  if (error) throw new Error('Error al crear nacionalidad');
  return data[0];
};

const updateNacionalidad = async (id, nombre) => {
  const { data, error } = await supabase
    .from('nacionalidad')
    .update({ nombre })
    .eq('id', id)
    .select();

  if (error) throw new Error('Error al actualizar nacionalidad');
  return data[0];
};

const deleteNacionalidad = async (id) => {
  const { error } = await supabase
    .from('nacionalidad')
    .delete()
    .eq('id', id);

  if (error) throw new Error('Error al eliminar nacionalidad');
  return { message: 'Nacionalidad eliminada' };
};

module.exports = {
  getNacionalidades,
  createNacionalidad,
  updateNacionalidad,
  deleteNacionalidad,
};
