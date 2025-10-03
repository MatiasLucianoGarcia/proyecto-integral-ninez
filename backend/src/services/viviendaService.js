const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');
const { validarTipoViviendaExiste } = require("../helpers/tipoViviendaHelper");

const crearVivienda = async (dni, tipo_vivienda, observaciones) => {
  // Validaciones
  await validarPersonaExiste(dni);
  await validarTipoViviendaExiste(tipo_vivienda);

  const { data, error } = await supabase
    .from("vivienda")
    .insert([{ dni, tipo_vivienda, observaciones }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerViviendas = async (dni) => {
  const { data, error } = await supabase
    .from('vivienda')
    .select(`tipo_vivienda(id,tipo), observaciones`)
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
    .select(`tipo_vivienda(id,tipo), observaciones`)
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
