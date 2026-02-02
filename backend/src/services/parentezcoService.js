const supabase = require('../config/db');

const crearParentezco = async (descripcion, id_inverso) => {
  const payload = { descripcion };
  if (id_inverso) {
    payload.id_inverso = id_inverso;
  }

  const { data, error } = await supabase
    .from('parentezco')
    .insert([payload])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerParentezcos = async () => {
  // Now we might want to also get the inverse details, but standard select * works for now
  const { data, error } = await supabase.from('parentezco').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data;
};

const actualizarParentezco = async (id, descripcion, id_inverso) => {
  const payload = { descripcion };
  if (id_inverso !== undefined) {
    // Allow passing null to clear the relationship
    payload.id_inverso = id_inverso;
  }

  const { data, error } = await supabase
    .from('parentezco')
    .update(payload)
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
