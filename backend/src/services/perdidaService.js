const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

const crearPerdida = async (dni, descripcion) => {
  // Validar que la persona exista
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('perdidas')
    .insert([{ dni, descripcion }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerPerdidas = async (dni) => {
  const { data, error } = await supabase
    .from('perdidas')
    .select('*')
    .eq('dni', dni);
  if (error) throw error;
  return data;
};

const eliminarPerdida = async (id) => {
  const { error } = await supabase
    .from('perdidas')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

const obtenerUltimaPerdidaPorDni = async (dni) => {
  const { data, error } = await supabase
    .from('perdidas')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data[0];
};

module.exports = {
  crearPerdida,
  obtenerPerdidas,
  eliminarPerdida,
  obtenerUltimaPerdidaPorDni
};
