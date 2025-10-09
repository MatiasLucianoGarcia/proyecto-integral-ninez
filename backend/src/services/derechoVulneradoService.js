const supabase = require('../config/db');

const crearDerechoVulnerado = async (descripcion) => {
  const { data, error } = await supabase
    .from('derecho_vulnerado')
    .insert([{ descripcion }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerDerechosVulnerados = async () => {
  const { data, error } = await supabase.from('derecho_vulnerado').select('*');
  if (error) throw error;
  return data;
};

const obtenerDerechoVulneradoPorId = async (id) => {
  const { data, error } = await supabase
    .from('derecho_vulnerado')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code === 'PGRST116') return null;
  if (error) throw error;
  return data;
};

const actualizarDerechoVulnerado = async (id, descripcion) => {
  const { data, error } = await supabase
    .from('derecho_vulnerado')
    .update({ descripcion })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data.length ? data[0] : null;
};

const eliminarDerechoVulnerado = async (id) => {
  const { error } = await supabase.from('derecho_vulnerado').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  crearDerechoVulnerado,
  obtenerDerechosVulnerados,
  obtenerDerechoVulneradoPorId,
  actualizarDerechoVulnerado,
  eliminarDerechoVulnerado,
};
