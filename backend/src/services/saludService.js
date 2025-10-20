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

  // Si no existe registro, mostrar mensaje claro
  if (error && error.code === 'PGRST116') {
    const err = new Error(`La persona con DNI ${dni} no existe`);
    err.status = 404;
    throw err;
  }

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

  // Si no existe el registro, devolver mensaje personalizado
  if (error && error.code === 'PGRST116') {
    const err = new Error(`La persona con DNI ${dni} no existe`);
    err.status = 404;
    throw err;
  }

  if (error) throw error;
  return data;
};

module.exports = {
  crearSalud,
  obtenerSalud,
  actualizarSalud,
};
