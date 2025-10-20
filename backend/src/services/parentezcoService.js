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
  const { data, error } = await supabase.from('parentezco').select('*').order('id', { ascending: true });
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

  if (!data || data.length === 0) {
    const err = new Error(`No existe parentezco con ID ${id}`);
    err.status = 404;
    throw err;
  }

  return data[0];
};

const eliminarParentezco = async (id) => {
  const { data, error } = await supabase
    .from('parentezco')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    const err = new Error(`No existe parentezco con ID ${id}`);
    err.status = 404;
    throw err;
  }

  return { message: 'Parentezco eliminado correctamente' };
};

module.exports = {
  crearParentezco,
  obtenerParentezcos,
  actualizarParentezco,
  eliminarParentezco,
};
