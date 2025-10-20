const supabase = require('../config/db');

// Crear rol
const crearRol = async (nombre_rol) => {
  const { data, error } = await supabase
    .from('rol')
    .insert([{ nombre_rol }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener todos los roles
const obtenerRoles = async () => {
  const { data, error } = await supabase.from('rol').select('*');
  if (error) throw error;
  return data;
};

// Actualizar rol
const actualizarRol = async (id, nombre_rol) => {
  const { data, error } = await supabase
    .from('rol')
    .update({ nombre_rol })
    .eq('id', id)
    .select()
    .single();

  if (error && error.code === 'PGRST116') {
    const err = new Error(`El rol con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (error) throw error;
  return data;
};

// Eliminar rol
const eliminarRol = async (id) => {
  // Verificar existencia antes de eliminar
  const { data: existe, error: checkError } = await supabase
    .from('rol')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError && checkError.code === 'PGRST116') {
    const err = new Error(`El rol con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (checkError) throw checkError;

  const { error } = await supabase.from('rol').delete().eq('id', id);
  if (error) throw error;

  return { message: 'Rol eliminado correctamente' };
};

module.exports = {
  crearRol,
  obtenerRoles,
  actualizarRol,
  eliminarRol,
};
