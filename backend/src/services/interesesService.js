const supabase = require('../config/db');

// Crear un registro vacío de intereses cuando se crea una persona
const crearIntereses = async (dni) => {
  const { data, error } = await supabase
    .from('intereses')
    .insert([{ dni, gustos: null, vinculos_significativos: null, datos_desarrollo: null }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener intereses por DNI
const obtenerIntereses = async (dni) => {
  const { data, error } = await supabase
    .from('intereses')
    .select('*')
    .eq('dni', dni)
    .single();

  if (error) throw error;
  return data;
};

// Actualizar intereses por DNI
const actualizarIntereses = async (dni, { gustos, vinculos_significativos, datos_desarrollo }) => {
  const { data, error } = await supabase
    .from('intereses')
    .update({ gustos, vinculos_significativos, datos_desarrollo })
    .eq('dni', dni)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  crearIntereses,
  obtenerIntereses,
  actualizarIntereses,
};
