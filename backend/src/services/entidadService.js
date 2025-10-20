const supabase = require('../config/db');

// Obtener todas las entidades
const getEntidades = async () => {
  const { data, error } = await supabase.from('entidad').select('*');
  if (error) throw error;
  return data || [];
};

// Crear entidad
const createEntidad = async ({ nombre, servicio_local, descripcion }) => {
  const { data, error } = await supabase
    .from('entidad')
    .insert([{ nombre, servicio_local, descripcion }])
    .select();

  if (error) throw error;
  return data[0];
};

// Actualizar entidad
const updateEntidad = async (id, { nombre, servicio_local, descripcion }) => {
  // Verificar existencia
  const { data: existente, error: errCheck } = await supabase
    .from('entidad')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`La entidad con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { data, error } = await supabase
    .from('entidad')
    .update({ nombre, servicio_local, descripcion })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Eliminar entidad
const deleteEntidad = async (id) => {
  // Verificar existencia
  const { data: existente, error: errCheck } = await supabase
    .from('entidad')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`La entidad con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { error } = await supabase.from('entidad').delete().eq('id', id);
  if (error) throw error;

  return { message: 'Entidad eliminada correctamente' };
};

module.exports = {
  getEntidades,
  createEntidad,
  updateEntidad,
  deleteEntidad,
};
