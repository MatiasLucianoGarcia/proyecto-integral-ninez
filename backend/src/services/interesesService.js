const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

// Crear un registro vacío de intereses cuando se crea una persona
const crearIntereses = async (dni) => {
  const { data, error } = await supabase
    .from('intereses')
    .insert([{ dni, gustos: null, vinculos_significativos: null, datos_desarrollo: null }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener intereses por DNI
const obtenerIntereses = async (dni) => {
  // Validar si existe la persona
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('intereses')
    .select('*')
    .eq('dni', dni)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`No hay ningún registro de intereses para el DNI ${dni}`);
    err.status = 404;
    throw err;
  }

  return data;
};

// Actualizar intereses por DNI
const actualizarIntereses = async (dni, { gustos, vinculos_significativos, datos_desarrollo }) => {
  // Validar que la persona exista
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('intereses')
    .update({ gustos, vinculos_significativos, datos_desarrollo })
    .eq('dni', dni)
    .select()
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`No hay ningún registro de intereses para el DNI ${dni}`);
    err.status = 404;
    throw err;
  }

  return data;
};

module.exports = {
  crearIntereses,
  obtenerIntereses,
  actualizarIntereses,
};
