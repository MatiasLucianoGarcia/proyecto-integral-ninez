const supabase = require('../config/db');

const crearParentezco = async (descripcion) => {
  const { data, error } = await supabase
    .from('parentezco')
    .insert([{ descripcion }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerParentezcos = async () => {
  const { data, error } = await supabase.from('parentezco').select('*');
  if (error) throw error;
  return data;
};

const actualizarParentezco = async (id, descripcion) => {
  const { data, error } = await supabase
    .from('parentezco')
    .update({ descripcion })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

const eliminarParentezco = async (id) => {
  const { error } = await supabase.from('parentezco').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  crearParentezco,
  obtenerParentezcos,
  actualizarParentezco,
  eliminarParentezco,
};
