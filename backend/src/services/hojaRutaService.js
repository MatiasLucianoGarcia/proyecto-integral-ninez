const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');
const { validarServicioLocalExiste } = require('../helpers/servicioLocalHelper');

// Crear hoja de ruta
const crearHojaRuta = async ({ id_servicio_local, fecha, actividad, resultado }) => {
  await validarServicioLocalExiste(id_servicio_local);

  const { data, error } = await supabase
    .from('hoja_ruta')
    .insert([{ id_servicio_local, fecha, actividad, resultado }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener todas las hojas de ruta por DNI
const obtenerHojasRutaPorDni = async (dni) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('hoja_ruta')
    .select('*, servicio_local(*)')
    .eq('servicio_local.dni', dni);

  if (error) throw error;
  return data;
};

// Obtener todas las hojas de ruta por ID de servicio local
const obtenerHojasRutaPorServicioLocalId = async (id_servicio_local) => {
  await validarServicioLocalExiste(id_servicio_local);

  const { data, error } = await supabase
    .from('hoja_ruta')
    .select('*')
    .eq('id_servicio_local', id_servicio_local);

  if (error) throw error;
  return data;
};

// Obtener hoja de ruta por ID
const obtenerHojaRutaPorId = async (id) => {
  const { data, error } = await supabase
    .from('hoja_ruta')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`La hoja de ruta con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  return data;
};

// Actualizar hoja de ruta
const actualizarHojaRuta = async (id, campos) => {
  const camposValidos = Object.fromEntries(Object.entries(campos).filter(([_, v]) => v !== undefined));

  const { data, error } = await supabase
    .from('hoja_ruta')
    .update(camposValidos)
    .eq('id', id)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    const err = new Error(`La hoja de ruta con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  return data[0];
};

// Eliminar hoja de ruta
const eliminarHojaRuta = async (id) => {
  const { data, error } = await supabase
    .from('hoja_ruta')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    const err = new Error(`La hoja de ruta con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  return data[0];
};

module.exports = {
  crearHojaRuta,
  obtenerHojasRutaPorDni,
  obtenerHojasRutaPorServicioLocalId,
  obtenerHojaRutaPorId,
  actualizarHojaRuta,
  eliminarHojaRuta,
};
