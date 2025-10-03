const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');

const crearDomicilio = async (dni, nombre, numero) => {
  // Validar que la persona exista
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('domicilio')
    .insert([{ dni, nombre, numero }])
    .select();

  if (error) throw error;
  return data[0];
};

const obtenerDomicilios = async (dni) => {
  const { data, error } = await supabase
    .from('domicilio')
    .select('*')
    .eq('dni', dni);
  if (error) throw error;
  return data;
};

const eliminarDomicilio = async (id) => {
  const { error } = await supabase
    .from('domicilio')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// Obtener el último domicilio de un DNI específico
const obtenerUltimoDomicilioPorDni = async (dni) => {
  const { data, error } = await supabase
    .from('domicilio')
    .select('*')
    .eq('dni', dni)
    .order('fecha_carga', { ascending: false }) 
    .limit(1); 

  if (error) throw error;
  return data[0]; 
};

module.exports = {
  crearDomicilio,
  obtenerDomicilios,
  eliminarDomicilio,
  obtenerUltimoDomicilioPorDni
};
