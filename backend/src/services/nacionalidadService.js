const supabase = require('../config/db');

const getNacionalidades = async () => {
  const { data, error } = await supabase.from('nacionalidad').select('*').order('id', { ascending: true });

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

  if (error) throw error;

  if (!data || data.length === 0) {
    const err = new Error(`La nacionalidad con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  return data[0];
};

const deleteNacionalidad = async (id) => {
  const { data, error } = await supabase
    .from('nacionalidad')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    const err = new Error(`La nacionalidad con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  return { message: 'Nacionalidad eliminada correctamente' };
};

module.exports = {
  getNacionalidades,
  createNacionalidad,
  updateNacionalidad,
  deleteNacionalidad,
};
