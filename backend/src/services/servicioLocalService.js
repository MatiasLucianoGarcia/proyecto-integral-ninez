const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');
const { validarEfectorExiste } = require('../helpers/efectorHelper');
const { validarDerechoVulneradoExiste } = require('../helpers/derechoVulneradoHelper');
const { validarEquipoLocalExiste } = require('../helpers/equipoLocalHelper');

// Crear servicio local
const crearServicioLocal = async ({ dni, id_equipo, fecha_ingreso, motivo_ingreso, id_efector, id_derecho }) => {
  await validarPersonaExiste(dni);
  if (id_equipo) await validarEquipoLocalExiste(id_equipo);
  if (id_efector) await validarEfectorExiste(id_efector);
  if (id_derecho) await validarDerechoVulneradoExiste(id_derecho);

  const { data, error } = await supabase
    .from('servicio_local')
    .insert([{ dni, id_equipo, fecha_ingreso, motivo_ingreso, id_efector, id_derecho }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener todos los servicios locales
const obtenerServiciosLocales = async () => {
  const { data, error } = await supabase.from('servicio_local').select('*');
  if (error) throw error;
  return data;
};

// Obtener servicio local por ID
const obtenerServicioLocalPorId = async (id) => {
  const { data, error } = await supabase.from('servicio_local').select('*').eq('id', id);
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[0];
};

// Actualizar servicio local
const actualizarServicioLocal = async (id, campos) => {
  if (campos.dni) await validarPersonaExiste(campos.dni);
  if (campos.id_equipo) await validarEquipoLocalExiste(campos.id_equipo);
  if (campos.id_efector) await validarEfectorExiste(campos.id_efector);
  if (campos.id_derecho) await validarDerechoVulneradoExiste(campos.id_derecho);

  const camposValidos = Object.fromEntries(Object.entries(campos).filter(([_, v]) => v !== undefined));

  const { data, error } = await supabase
    .from('servicio_local')
    .update(camposValidos)
    .eq('id', id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[0];
};

// Eliminar servicio local
const eliminarServicioLocal = async (id) => {
  const { data, error } = await supabase.from('servicio_local').delete().eq('id', id).select();
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[0];
};

// Obtener servicios locales por DNI
const obtenerServiciosLocalesPorDni = async (dni) => {
  await validarPersonaExiste(dni); // Si no existe, lanza error

  const { data, error } = await supabase
    .from('servicio_local')
    .select('*')
    .eq('dni', dni);

  if (error) throw error;
  return data; // puede venir vacío []
};

module.exports = {
  crearServicioLocal,
  obtenerServiciosLocales,
  obtenerServicioLocalPorId,
  actualizarServicioLocal,
  eliminarServicioLocal,
  obtenerServiciosLocalesPorDni,
};
