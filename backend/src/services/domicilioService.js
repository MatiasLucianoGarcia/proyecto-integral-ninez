const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

// Crear domicilio
const crearDomicilio = async (dni, nombre, numero) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('domicilio')
    .insert([{ dni, nombre, numero }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener domicilios por DNI
const obtenerDomicilios = async (dni) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('domicilio')
    .select('*')
    .eq('dni', dni);

  if (error) throw error;

  // Si no tiene domicilios, devolvemos lista vacía
  return data || [];
};

// Eliminar domicilio por ID
const eliminarDomicilio = async (id) => {
  // Verificar si existe antes de eliminar
  const { data: existente, error: errCheck } = await supabase
    .from('domicilio')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`El domicilio con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { error } = await supabase
    .from('domicilio')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return { message: 'Domicilio eliminado correctamente' };
};

// Obtener el último domicilio de un DNI
const obtenerUltimoDomicilioPorDni = async (dni) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('domicilio')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false })
    .limit(1);

  if (error) throw error;

  // Si no hay registros, devolvemos null
  return data && data.length > 0 ? data[0] : null;
};

module.exports = {
  crearDomicilio,
  obtenerDomicilios,
  eliminarDomicilio,
  obtenerUltimoDomicilioPorDni,
};
