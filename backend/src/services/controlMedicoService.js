const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

// Crear control médico
const crearControlMedico = async (dni, unidad_sanitaria, observaciones) => {
  // 🔎 Verificar que la persona exista (lanza error si no)
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('control_medico')
    .insert([{ dni, unidad_sanitaria, observaciones }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener todos los controles de un DNI
const obtenerControlesMedicos = async (dni) => {
  // 🔎 Verificar existencia de persona
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('control_medico')
    .select('*')
    .eq('dni', dni);

  if (error) throw error;
  return data || [];
};

// Eliminar control médico
const eliminarControlMedico = async (id) => {
  // 🔎 Verificar si el control existe antes de eliminar
  const { data: existente, error: errCheck } = await supabase
    .from('control_medico')
    .select('id')
    .eq('id', id)
    .single();

  // Si no existe el registro
  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`El control médico con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (errCheck) throw errCheck;

  // Eliminar registro
  const { error } = await supabase
    .from('control_medico')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { message: 'Control médico eliminado correctamente' };
};

// Obtener el último control médico por DNI
const obtenerUltimoControlMedicoPorDni = async (dni) => {
  // 🔎 Verificar existencia de persona
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('control_medico')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0];
};

module.exports = {
  crearControlMedico,
  obtenerControlesMedicos,
  eliminarControlMedico,
  obtenerUltimoControlMedicoPorDni,
};
