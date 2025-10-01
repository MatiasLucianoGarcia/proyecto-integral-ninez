const supabase = require('../config/db');

const crearEscolaridad = async (dni, escuela, nivel, año) => {
  const { data, error } = await supabase
    .from('escolaridad')
    .insert([{ dni, escuela, nivel, año}])
    .select();
  if (error) throw error;
  return data[0];
};

const obtenerEscolaridades = async (dni) => {
  const { data, error } = await supabase
    .from('escolaridad')
    .select('*')
    .eq('dni', dni);
  if (error) throw error;
  return data;
};

const eliminarEscolaridad = async (id) => {
  const { error } = await supabase
    .from('escolaridad')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// Obtener la última escolaridad cargada para un DNI
const obtenerUltimaEscolaridadPorDni = async (dni) => {
  const { data, error } = await supabase
    .from('escolaridad')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0];
};

module.exports = {
  crearEscolaridad,
  obtenerEscolaridades,
  eliminarEscolaridad,
  obtenerUltimaEscolaridadPorDni
};