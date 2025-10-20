const supabase = require('../config/db');

// Obtener todos los géneros
const obtenerGeneros = async () => {
  const { data, error } = await supabase.from('genero').select('*');
  if (error) throw error;
  return data;
};

// Crear género
const crearGenero = async (nombre) => {
  const { data, error } = await supabase
    .from('genero')
    .insert([{ nombre }])
    .select();

  if (error) throw error;
  return data[0];
};

// Actualizar género
const actualizarGenero = async (id, nombre) => {
  // Verificar si existe
  const { data: existente, error: errorExiste } = await supabase
    .from('genero')
    .select('id')
    .eq('id', id)
    .single();

  if (errorExiste || !existente) {
    const err = new Error(`El género con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  const { data, error } = await supabase
    .from('genero')
    .update({ nombre })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Eliminar género
const eliminarGenero = async (id) => {
  // Verificar si existe
  const { data: existente, error: errorExiste } = await supabase
    .from('genero')
    .select('id')
    .eq('id', id)
    .single();

  if (errorExiste || !existente) {
    const err = new Error(`El género con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  const { error } = await supabase.from('genero').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  obtenerGeneros,
  crearGenero,
  actualizarGenero,
  eliminarGenero,
};
