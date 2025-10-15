const supabase = require('../config/db');
const { validarEfectorExiste } = require('../helpers/efectorHelper');
const { validarIngresoProgramaExiste } = require('../helpers/ingresoProgramaHelper');
const { validarPersonaExiste } = require('../helpers/personaHelper');

// Crear articulación
const crearArticulacion = async ({ id_ingreso, id_efector, observacion, fecha_articulacion }) => {
  await validarIngresoProgramaExiste(id_ingreso);
  if (id_efector) await validarEfectorExiste(id_efector);

  const { data, error } = await supabase
    .from('articulacion')
    .insert([{ id_ingreso, id_efector, observacion, fecha_articulacion }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener todas las articulaciones por DNI
const obtenerArticulacionesPorDni = async (dni) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from('articulacion')
    .select('*, ingreso_programa!inner(dni)')
    .eq('ingreso_programa.dni', dni);

  if (error) throw error;
  return data;
};

// Obtener articulaciones por DNI e ID de ingreso
const obtenerArticulacionesPorDniEIngreso = async (dni, id_ingreso) => {
  await validarPersonaExiste(dni);
  await validarIngresoProgramaExiste(id_ingreso);

  const { data, error } = await supabase
    .from('articulacion')
    .select('*, ingreso_programa!inner(dni)')
    .eq('ingreso_programa.dni', dni)
    .eq('id_ingreso', id_ingreso);

  if (error) throw error;
  return data;
};

// Obtener articulación por ID
const obtenerArticulacionPorId = async (id) => {
  const { data, error } = await supabase
    .from('articulacion')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`La articulacion con id ${id} no existe`);
    err.status = 404;
    throw err;
  }

  return data;
};

// Actualizar articulación
const actualizarArticulacion = async (id, campos) => {
  if (campos.id_ingreso) await validarIngresoProgramaExiste(campos.id_ingreso);
  if (campos.id_efector) await validarEfectorExiste(campos.id_efector);

  const camposValidos = Object.fromEntries(Object.entries(campos).filter(([_, v]) => v !== undefined));

  const { data, error } = await supabase
    .from('articulacion')
    .update(camposValidos)
    .eq('id', id)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    const err = new Error(`La articulacion con id ${id} no existe`);
    err.status = 404;
    throw err;
  }

  return data[0];
};

// Eliminar articulación
const eliminarArticulacion = async (id) => {
  const { data, error } = await supabase
    .from('articulacion')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    const err = new Error(`La articulacion con id ${id} no existe`);
    err.status = 404;
    throw err;
  }

  return data[0];
};

module.exports = {
  crearArticulacion,
  obtenerArticulacionesPorDni,
  obtenerArticulacionesPorDniEIngreso,
  obtenerArticulacionPorId,
  actualizarArticulacion,
  eliminarArticulacion,
};
