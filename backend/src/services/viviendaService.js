const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');
const { validarTipoViviendaExiste } = require("../helpers/tipoViviendaHelper");

const crearVivienda = async (dni, tipo_vivienda, observaciones) => {
  await validarPersonaExiste(dni);
  await validarTipoViviendaExiste(tipo_vivienda);

  const { data, error } = await supabase
    .from("vivienda")
    .insert([{ dni, tipo_vivienda, observaciones }])
    .select();

  if (error) throw error;
  return data[0];
};

// ✅ Verifica que exista la persona antes de buscar viviendas
const obtenerViviendas = async (dni) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('vivienda')
    .select(`id, fecha_carga, tipo_vivienda(id,tipo), observaciones`)
    .eq('dni', dni);

  if (error) throw error;
  return data;
};

// ✅ Verifica que la vivienda exista antes de eliminar
const eliminarVivienda = async (id) => {
  // Primero verificar existencia
  const { data: viviendaExiste, error: errorBusqueda } = await supabase
    .from('vivienda')
    .select('id')
    .eq('id', id)
    .single();

  if (errorBusqueda || !viviendaExiste) {
    throw { status: 404, message: `La vivienda con ID ${id} no existe` };
  }

  // Eliminar
  const { error } = await supabase.from('vivienda').delete().eq('id', id);
  if (error) throw error;
};

// ✅ También valida existencia de persona antes de buscar la última
const obtenerUltimaViviendaPorDni = async (dni) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('vivienda')
    .select(`id, fecha_carga, tipo_vivienda(id,tipo), observaciones`)
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
