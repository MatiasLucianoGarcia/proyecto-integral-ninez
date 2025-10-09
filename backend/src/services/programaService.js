const supabase = require('../config/db');

// Crear programa
const crearPrograma = async ({ nombre, descripcion }) => {
  const { data, error } = await supabase
    .from('programa')
    .insert([{ nombre, descripcion }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener todos los programas
const obtenerProgramas = async () => {
  const { data, error } = await supabase.from('programa').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data;
};

// Obtener programa por ID
const obtenerProgramaPorId = async (id) => {
  const { data, error } = await supabase.from('programa').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Actualizar programa
const actualizarPrograma = async (id, { nombre, descripcion }) => {
  const { data, error } = await supabase
    .from('programa')
    .update({ nombre, descripcion })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Eliminar programa
const eliminarPrograma = async (id) => {
  const { error } = await supabase.from('programa').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  crearPrograma,
  obtenerProgramas,
  obtenerProgramaPorId,
  actualizarPrograma,
  eliminarPrograma,
};
