const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

// Crear pérdida
const crearPerdida = async (dni, descripcion) => {
  await validarPersonaExiste(dni); // usamos el helper tal cual está

  const { data, error } = await supabase
    .from('perdidas')
    .insert([{ dni, descripcion }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener pérdidas por DNI
const obtenerPerdidas = async (dni) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('perdidas')
    .select('*')
    .eq('dni', dni);

  if (error) throw error;
  return data || [];
};

// Eliminar pérdida por ID
const eliminarPerdida = async (id) => {
  // Verificar si la pérdida existe antes de eliminar
  const { data: existente, error: errCheck } = await supabase
    .from('perdidas')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`La pérdida con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (errCheck) throw errCheck;

  const { error } = await supabase
    .from('perdidas')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { message: 'Pérdida eliminada correctamente' };
};

// Obtener última pérdida por DNI
const obtenerUltimaPerdidaPorDni = async (dni) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('perdidas')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0] || null;
};

module.exports = {
  crearPerdida,
  obtenerPerdidas,
  eliminarPerdida,
  obtenerUltimaPerdidaPorDni,
};
