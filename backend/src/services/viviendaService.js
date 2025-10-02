const supabase = require('../config/db');

const crearVivienda = async (dni, tipo_vivienda, observaciones) => {
  const { data, error } = await supabase
    .from('vivienda')
    .insert([{ dni, tipo_vivienda, observaciones }])
    .select();
  if (error) throw error;
  return data[0];
};

const obtenerViviendas = async (dni) => {
  const { data, error } = await supabase
    .from('vivienda')
    .select('*')
    .eq('dni', dni);
  if (error) throw error;
  return data;
};

const eliminarVivienda = async (id) => {
  const { error } = await supabase
    .from('vivienda')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

const obtenerUltimaViviendaPorDni = async (dni) => {
  const { data, error } = await supabase
    .from('vivienda')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0];
};

module.exports = {
  crearVivienda,
  obtenerViviendas,
  eliminarVivienda,
  obtenerUltimaViviendaPorDni
};
