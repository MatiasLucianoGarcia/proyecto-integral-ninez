const supabase = require('../config/db');

const crearEquipoLocal = async (nombre) => {
  const { data, error } = await supabase
    .from('equipo_local')
    .insert([{ nombre }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerEquiposLocales = async () => {
  const { data, error } = await supabase.from('equipo_local').select('*');
  if (error) throw error;
  return data;
};

const obtenerEquipoLocalPorId = async (id) => {
  const { data, error } = await supabase
    .from('equipo_local')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code === 'PGRST116') return null; // sin resultados
  if (error) throw error;
  return data;
};

const actualizarEquipoLocal = async (id, nombre) => {
  const { data, error } = await supabase
    .from('equipo_local')
    .update({ nombre })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data.length ? data[0] : null;
};

const eliminarEquipoLocal = async (id) => {
  const { error } = await supabase.from('equipo_local').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  crearEquipoLocal,
  obtenerEquiposLocales,
  obtenerEquipoLocalPorId,
  actualizarEquipoLocal,
  eliminarEquipoLocal,
};
