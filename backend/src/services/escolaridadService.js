const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

const crearEscolaridad = async (dni, escuela, nivel, anio) => {
  // Validar que la persona exista
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('escolaridad')
    .insert([{ dni, escuela, nivel, anio }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerEscolaridades = async (dni) => {
  // Validar que la persona exista
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('escolaridad')
    .select('*')
    .eq('dni', dni);

  if (error) throw error;

  // Si no hay escolaridades, devolvemos lista vacía (ya está bien)
  return data;
};

const eliminarEscolaridad = async (id) => {
  // Verificar si existe la escolaridad antes de eliminar
  const { data: existe, error: errCheck } = await supabase
    .from('escolaridad')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`La escolaridad con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { error } = await supabase.from('escolaridad').delete().eq('id', id);
  if (error) throw error;

  return { message: 'Escolaridad eliminada' };
};

// Obtener la última escolaridad cargada para un DNI
const obtenerUltimaEscolaridadPorDni = async (dni) => {
  // Validar que la persona exista
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('escolaridad')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);

  if (error) throw error;

  // Si no tiene registros, devolvemos null
  return data[0] || null;
};

module.exports = {
  crearEscolaridad,
  obtenerEscolaridades,
  eliminarEscolaridad,
  obtenerUltimaEscolaridadPorDni,
};
