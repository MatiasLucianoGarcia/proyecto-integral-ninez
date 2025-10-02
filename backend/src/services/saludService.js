const supabase = require('../config/db');

// Crear registro vacío al crear persona
const crearSalud = async (dni) => {
  const { data, error } = await supabase
    .from('salud')
    .insert([{
      dni,
      nombre: null,
      enfermedad_cronica: null,
      tratamiento_prolongado: null,
      discapacidad: null,
      adicciones: null
    }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener por DNI
const obtenerSalud = async (dni) => {
  const { data, error } = await supabase
    .from('salud')
    .select('*')
    .eq('dni', dni)
    .single();

  if (error) throw error;
  return data;
};

// Actualizar por DNI
const actualizarSalud = async (dni, { nombre, enfermedad_cronica, tratamiento_prolongado, discapacidad, adicciones }) => {
  const { data, error } = await supabase
    .from('salud')
    .update({ nombre, enfermedad_cronica, tratamiento_prolongado, discapacidad, adicciones })
    .eq('dni', dni)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  crearSalud,
  obtenerSalud,
  actualizarSalud,
};
