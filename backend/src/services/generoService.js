const supabase = require('../config/db');

// Obtener todas las géneros
const obtenerGeneros = async () => {
  const { data, error } = await supabase.from('genero').select('*');
  return { data, error };
};

// Crear género
const crearGenero = async (nombre) => {
  const { data, error } = await supabase.from('genero').insert([{ nombre }]).select();
  return { data, error };
};

// Actualizar género
const actualizarGenero = async (id, nombre) => {
  const { data, error } = await supabase
    .from('genero')
    .update({ nombre })
    .eq('id', id)
    .select();
  return { data, error };
};

// Eliminar género
const eliminarGenero = async (id) => {
  const { error } = await supabase.from('genero').delete().eq('id', id);
  return { error };
};

module.exports = {
  obtenerGeneros,
  crearGenero,
  actualizarGenero,
  eliminarGenero,
};
