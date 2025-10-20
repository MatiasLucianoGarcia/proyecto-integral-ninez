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
  return data || [];
};

const obtenerEquipoLocalPorId = async (id) => {
  const { data, error } = await supabase
    .from('equipo_local')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code === 'PGRST116') return null; // No existe
  if (error) throw error;
  return data;
};

const actualizarEquipoLocal = async (id, nombre) => {
  // Verificamos si existe antes de actualizar
  const { data: existe, error: errCheck } = await supabase
    .from('equipo_local')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`El equipo local con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { data, error } = await supabase
    .from('equipo_local')
    .update({ nombre })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

const eliminarEquipoLocal = async (id) => {
  // Verificamos si existe antes de eliminar
  const { data: existe, error: errCheck } = await supabase
    .from('equipo_local')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`El equipo local con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { error } = await supabase.from('equipo_local').delete().eq('id', id);
  if (error) throw error;

  return { message: 'Equipo local eliminado correctamente' };
};

module.exports = {
  crearEquipoLocal,
  obtenerEquiposLocales,
  obtenerEquipoLocalPorId,
  actualizarEquipoLocal,
  eliminarEquipoLocal,
};
