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
    .select()
    .single();

  // Si no hay coincidencia, mostrar mensaje claro
  if (error && error.code === 'PGRST116') {
    const err = new Error(`La vivienda con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (error) throw error;
  return data;
};

const eliminarTipoVivienda = async (id) => {
  // Verificamos si existe antes de eliminar
  const { data: existente, error: errCheck } = await supabase
    .from('tipo_vivienda')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`La vivienda con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (errCheck) throw errCheck;

  const { error } = await supabase.from('tipo_vivienda').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  crearTipoVivienda,
  obtenerTiposVivienda,
  actualizarTipoVivienda,
  eliminarTipoVivienda,
};
