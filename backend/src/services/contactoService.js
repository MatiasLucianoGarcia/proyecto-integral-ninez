const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

const crearContacto = async (dni, telefono) => {
  // 🔎 Verificar que la persona exista antes de insertar
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('contacto')
    .insert([{ dni, telefono }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerContactos = async (dni) => {
  // 🔎 Verificar existencia de persona
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('contacto')
    .select('*')
    .eq('dni', dni);

  if (error) throw error;
  return data || [];
};

const eliminarContacto = async (id) => {
  // 🔎 Verificar si el contacto existe antes de eliminar
  const { data: existente, error: errCheck } = await supabase
    .from('contacto')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`El contacto con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (errCheck) throw errCheck;

  const { error } = await supabase
    .from('contacto')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { message: 'Contacto eliminado correctamente' };
};

// Obtener el último contacto de un DNI específico
const obtenerUltimoContactoPorDni = async (dni) => {
  // 🔎 Verificar existencia de persona
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('contacto')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0];
};

module.exports = {
  crearContacto,
  obtenerContactos,
  eliminarContacto,
  obtenerUltimoContactoPorDni,
};
