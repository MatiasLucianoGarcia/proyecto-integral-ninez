const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

const crearActividad = async (dni, actividad, horario, observaciones) => {
  // 🔎 Verificar que la persona exista antes de insertar
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('actividades')
    .insert([{ dni, actividad, horario, observaciones }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerActividades = async (dni) => {
  const { data, error } = await supabase
    .from('actividades')
    .select('*')
    .eq('dni', dni);
  if (error) throw error;
  return data;
};

const eliminarActividad = async (id) => {
  const { error } = await supabase
    .from('actividades')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

const obtenerUltimaActividadPorDni = async (dni) => {
  const { data, error } = await supabase
    .from('actividades')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data[0];
};

module.exports = {
  crearActividad,
  obtenerActividades,
  eliminarActividad,
  obtenerUltimaActividadPorDni
};
