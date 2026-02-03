const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

const crearTrabajo = async (dni, descripcion, horario, fecha_real) => {
  // Validar que la persona exista
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('trabajo')
    .insert([{ dni, descripcion, horario, fecha_real }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerTrabajos = async (dni) => {
  // Verificar que la persona exista
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('trabajo')
    .select('*')
    .eq('dni', dni);

  if (error) throw error;
  return data;
};

const eliminarTrabajo = async (id) => {
  // Verificar si el trabajo existe antes de eliminar
  const { data: existente, error: checkError } = await supabase
    .from('trabajo')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError && checkError.code === 'PGRST116') {
    const err = new Error(`El trabajo con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (checkError) throw checkError;

  const { error } = await supabase.from('trabajo').delete().eq('id', id);
  if (error) throw error;
};

const obtenerUltimoTrabajoPorDni = async (dni) => {
  // Verificar que la persona exista
  await validarPersonaExiste(dni);

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
  obtenerUltimoTrabajoPorDni,
};
