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

// Obtener por DNI (Crear si no existe - Lazy Initialization)
const obtenerSalud = async (dni) => {
  const { data, error } = await supabase
    .from('salud')
    .select('*')
    .eq('dni', dni)
    .single();

  // Si no existe registro, crearlo automáticamente
  if (error && error.code === 'PGRST116') {
    console.log(`Registro de salud no encontrado para DNI ${dni}, creando...`);
    return await crearSalud(dni);
  }

  if (error) throw error;
  return data;
};

// Actualizar por DNI (Upsret)
const actualizarSalud = async (dni, { nombre, enfermedad_cronica, tratamiento_prolongado, discapacidad, adicciones }) => {
  // Primero intentamos actualizar
  const { data, error } = await supabase
    .from('salud')
    .update({ nombre, enfermedad_cronica, tratamiento_prolongado, discapacidad, adicciones })
    .eq('dni', dni)
    .select()
    .single();

  // Si no existe (aunque obtenerSalud debería haberlo creado, por seguridad manejamos el caso), lo insertamos
  if (error && error.code === 'PGRST116') {
    const { data: newData, error: insertError } = await supabase
      .from('salud')
      .insert([{ dni, nombre, enfermedad_cronica, tratamiento_prolongado, discapacidad, adicciones }])
      .select()
      .single();

    if (insertError) throw insertError;
    return newData;
  }

  if (error) throw error;
  return data;
};

module.exports = {
  crearSalud,
  obtenerSalud,
  actualizarSalud,
};
