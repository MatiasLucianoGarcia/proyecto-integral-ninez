const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');
const { validarEfectorExiste } = require('../helpers/efectorHelper');
const { validarProgramaExiste } = require('../helpers/programasHelper');

// Crear ingreso
const crearIngreso = async ({ dni, id_programa, id_efector, dni_familiar, fecha_ingreso, observaciones }) => {
  await validarProgramaExiste(id_programa);
  await validarPersonaExiste(dni);
  if (dni_familiar) await validarPersonaExiste(dni_familiar);
  if (id_efector) await validarEfectorExiste(id_efector);

  // Verificar si ya existe ese ingreso para el mismo DNI y programa
  const { data: existente, error: errorExistente } = await supabase
    .from('ingreso_programa')
    .select('id')
    .eq('dni', dni)
    .eq('id_programa', id_programa)
    .maybeSingle();

  if (errorExistente && errorExistente.code !== 'PGRST116') throw errorExistente;
  if (existente) {
    const err = new Error('Este ingreso ya existe');
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from('ingreso_programa')
    .insert([{ dni, id_programa, id_efector, dni_familiar, fecha_ingreso, observaciones }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener todos los ingresos
const obtenerTodosLosIngresos = async () => {
  const { data, error } = await supabase
    .from('ingreso_programa')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data;
};

// Obtener ingreso por ID
const obtenerIngresoPorId = async (id) => {
  const { data, error } = await supabase
    .from('ingreso_programa')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`No hay ningun ingreso con ese id`);
    err.status = 404;
    throw err;
  }

  return data;
};

// Obtener ingresos por DNI
const obtenerIngresosPorDni = async (dni) => {
  const { data: persona } = await supabase.from('persona').select('dni').eq('dni', dni).single();

  if (!persona) {
    const err = new Error(`No hay ninguna persona con ese DNI`);
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from('ingreso_programa')
    .select('*')
    .eq('dni', dni);

  if (error) throw error;
  return data; // puede venir []
};

// Actualizar ingreso
const actualizarIngreso = async (id, campos) => {
  if (campos.dni) await validarPersonaExiste(campos.dni);
  if (campos.id_programa) await validarProgramaExiste(campos.id_programa);
  if (campos.id_efector) await validarEfectorExiste(campos.id_efector);
  if (campos.dni_familiar) await validarPersonaExiste(campos.dni_familiar);

  const camposValidos = Object.fromEntries(Object.entries(campos).filter(([_, v]) => v !== undefined));

  const { data, error } = await supabase
    .from('ingreso_programa')
    .update(camposValidos)
    .eq('id', id)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    const err = new Error(`No hay ningun ingreso con ese id`);
    err.status = 404;
    throw err;
  }

  return data[0];
};

// Eliminar ingreso
const eliminarIngreso = async (id) => {
  const { data, error } = await supabase
    .from('ingreso_programa')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    const err = new Error(`No hay ningun ingreso con ese id`);
    err.status = 404;
    throw err;
  }

  return data[0];
};

module.exports = {
  crearIngreso,
  obtenerTodosLosIngresos,
  obtenerIngresoPorId,
  obtenerIngresosPorDni,
  actualizarIngreso,
  eliminarIngreso,
};
