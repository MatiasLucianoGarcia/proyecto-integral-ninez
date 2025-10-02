const supabase = require('../config/db');

// Crear registro vacío al crear persona
const crearCondicionesVida = async (dni) => {
  const { data, error } = await supabase
    .from('condiciones_vida')
    .insert([{
      dni,
      acceso_luz: null,
      acceso_gas: null,
      acceso_agua: null,
      acceso_internet: null,
      alimentos_propios: null
    }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener por DNI
const obtenerCondicionesVida = async (dni) => {
  const { data, error } = await supabase
    .from('condiciones_vida')
    .select('*')
    .eq('dni', dni)
    .single();

  if (error) throw error;
  return data;
};

// Actualizar por DNI
const actualizarCondicionesVida = async (dni, { acceso_luz, acceso_gas, acceso_agua, acceso_internet, alimentos_propios }) => {
  const { data, error } = await supabase
    .from('condiciones_vida')
    .update({ acceso_luz, acceso_gas, acceso_agua, acceso_internet, alimentos_propios })
    .eq('dni', dni)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  crearCondicionesVida,
  obtenerCondicionesVida,
  actualizarCondicionesVida,
};
