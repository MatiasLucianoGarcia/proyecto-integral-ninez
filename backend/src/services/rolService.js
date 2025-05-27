const supabase = require('../config/db');

const crearRol = async (nombre_rol) => {
  const { data, error } = await supabase
    .from('rol')
    .insert([{ nombre_rol }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerRoles = async () => {
  const { data, error } = await supabase.from('rol').select('*');
  if (error) throw error;
  return data;
};

const actualizarRol = async (id, nombre_rol) => {
  const { data, error } = await supabase
    .from('rol')
    .update({ nombre_rol })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

const eliminarRol = async (id) => {
  const { error } = await supabase.from('rol').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  crearRol,
  obtenerRoles,
  actualizarRol,
  eliminarRol,
};
