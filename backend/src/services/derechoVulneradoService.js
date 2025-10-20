const supabase = require('../config/db');

// Crear derecho vulnerado
const crearDerechoVulnerado = async (descripcion) => {
  const { data, error } = await supabase
    .from('derecho_vulnerado')
    .insert([{ descripcion }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener todos los derechos vulnerados
const obtenerDerechosVulnerados = async () => {
  const { data, error } = await supabase.from('derecho_vulnerado').select('*');
  if (error) throw error;
  return data || [];
};

// Obtener derecho vulnerado por ID
const obtenerDerechoVulneradoPorId = async (id) => {
  const { data, error } = await supabase
    .from('derecho_vulnerado')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code === 'PGRST116') {
    const err = new Error(`El derecho vulnerado con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (error) throw error;
  return data;
};

// Actualizar derecho vulnerado
const actualizarDerechoVulnerado = async (id, descripcion) => {
  // Verificar existencia primero
  const { data: existente, error: errCheck } = await supabase
    .from('derecho_vulnerado')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`El derecho vulnerado con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { data, error } = await supabase
    .from('derecho_vulnerado')
    .update({ descripcion })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Eliminar derecho vulnerado
const eliminarDerechoVulnerado = async (id) => {
  // Verificar existencia antes de eliminar
  const { data: existente, error: errCheck } = await supabase
    .from('derecho_vulnerado')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`El derecho vulnerado con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { error } = await supabase
    .from('derecho_vulnerado')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { message: 'Derecho vulnerado eliminado correctamente' };
};

module.exports = {
  crearDerechoVulnerado,
  obtenerDerechosVulnerados,
  obtenerDerechoVulneradoPorId,
  actualizarDerechoVulnerado,
  eliminarDerechoVulnerado,
};
