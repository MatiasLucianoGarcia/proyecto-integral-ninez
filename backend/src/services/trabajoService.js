const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

const crearTrabajo = async (dni, descripcion, horario) => {
  // Validar que la persona exista
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('trabajo')
    .insert([{ dni, descripcion, horario }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerTrabajos = async (dni) => {
  const { data, error } = await supabase
    .from('trabajo')
    .select('*')
    .eq('dni', dni);

  if (error) throw error;
  return data;
};

const eliminarTrabajo = async (id) => {
  const { error } = await supabase
    .from('trabajo')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

const obtenerUltimoTrabajoPorDni = async (dni) => {
  const { data, error } = await supabase
    .from('trabajo')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0];
};

module.exports = {
  crearTrabajo,
  obtenerTrabajos,
  eliminarTrabajo,
  obtenerUltimoTrabajoPorDni
};
