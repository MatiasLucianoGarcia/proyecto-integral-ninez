const supabase = require('../config/db');

const crearContacto = async (dni, telefono, fecha_carga) => {
  const { data, error } = await supabase
    .from('contacto')
    .insert([{ dni, telefono, fecha_carga }])
    .select();
  if (error) throw error;
  return data[0];
};

const obtenerContactos = async (dni) => {
  const { data, error } = await supabase
    .from('contacto')
    .select('*')
    .eq('dni', dni);
  if (error) throw error;
  return data;
};

const eliminarContacto = async (id) => {
  const { error } = await supabase
    .from('contacto')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// Obtener el último domicilio de un DNI específico
const obtenerUltimoContactoPorDni = async (dni) => {
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
  obtenerUltimoContactoPorDni
};
