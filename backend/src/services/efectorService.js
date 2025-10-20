const supabase = require('../config/db');

// Crear efector
const crearEfector = async ({ nombre, area }) => {
  const { data, error } = await supabase
    .from('efector')
    .insert([{ nombre, area }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener todos los efectores
const obtenerEfectores = async () => {
  const { data, error } = await supabase.from('efector').select('*');
  if (error) throw error;
  return data || [];
};

// Obtener efector por ID
const obtenerEfectorPorId = async (id) => {
  const { data, error } = await supabase.from('efector').select('*').eq('id', id).single();

  if (error && error.code === 'PGRST116') {
    const err = new Error(`El efector con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (error) throw error;
  return data;
};

// Actualizar efector
const actualizarEfector = async (id, { nombre, area }) => {
  // Verificar existencia
  const { data: existente, error: errCheck } = await supabase
    .from('efector')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`El efector con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { data, error } = await supabase
    .from('efector')
    .update({ nombre, area })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Eliminar efector
const eliminarEfector = async (id) => {
  // Verificar existencia
  const { data: existente, error: errCheck } = await supabase
    .from('efector')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`El efector con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { error } = await supabase.from('efector').delete().eq('id', id);
  if (error) throw error;

  return { message: 'Efector eliminado correctamente' };
};

module.exports = {
  crearEfector,
  obtenerEfectores,
  obtenerEfectorPorId,
  actualizarEfector,
  eliminarEfector,
};
