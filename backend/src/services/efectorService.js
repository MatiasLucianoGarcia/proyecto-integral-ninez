const supabase = require('../config/db');

const crearEfector = async ({ nombre, area }) => {
  const { data, error } = await supabase
    .from('efector')
    .insert([{ nombre, area }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerEfectores = async () => {
  const { data, error } = await supabase.from('efector').select('*');
  if (error) throw error;
  return data;
};

const obtenerEfectorPorId = async (id) => {
  const { data, error } = await supabase.from('efector').select('*').eq('id', id);

  if (error) throw error;

  // Si no hay resultados, devolvemos null para que lo maneje el controller
  if (!data || data.length === 0) return null;

  return data[0];
};

const actualizarEfector = async (id, { nombre, area }) => {
  const { data, error } = await supabase
    .from('efector')
    .update({ nombre, area })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

const eliminarEfector = async (id) => {
  const { error } = await supabase.from('efector').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  crearEfector,
  obtenerEfectores,
  obtenerEfectorPorId,
  actualizarEfector,
  eliminarEfector,
};
