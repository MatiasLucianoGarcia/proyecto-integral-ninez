const supabase = require('../config/db');

const crearControlMedico = async (dni, unidad_sanitaria, observaciones) => {
  const { data, error } = await supabase
    .from('control_medico')
    .insert([{ dni, unidad_sanitaria, observaciones }])
    .select();
  if (error) throw error;
  return data[0];
};

const obtenerControlesMedicos = async (dni) => {
  const { data, error } = await supabase
    .from('control_medico')
    .select('*')
    .eq('dni', dni);
  if (error) throw error;
  return data;
};

const eliminarControlMedico = async (id) => {
  const { error } = await supabase
    .from('control_medico')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// Obtener el último control médico cargado para un DNI
const obtenerUltimoControlMedicoPorDni = async (dni) => {
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
  obtenerUltimoControlMedicoPorDni
};
