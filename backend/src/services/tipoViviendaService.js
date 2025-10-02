const supabase = require('../config/db');

const crearTipoVivienda = async (tipo) => {
  const { data, error } = await supabase
    .from('tipo_vivienda')
    .insert([{ tipo }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerTiposVivienda = async () => {
  const { data, error } = await supabase.from('tipo_vivienda').select('*');
  if (error) throw error;
  return data;
};

const actualizarTipoVivienda = async (id, tipo) => {
  const { data, error } = await supabase
    .from('tipo_vivienda')
    .update({ tipo })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

const eliminarTipoVivienda = async (id) => {
  const { error } = await supabase.from('tipo_vivienda').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  crearTipoVivienda,
  obtenerTiposVivienda,
  actualizarTipoVivienda,
  eliminarTipoVivienda,
};
