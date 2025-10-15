const supabase = require("../config/db");
const { validarPersonaExiste } = require("../helpers/personaHelper");

// Crear historial
const createHistorial = async ({ dni, intervencion, resultado }) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from("historial")
    .insert([{ dni, intervencion, resultado }])
    .select();

  if (error) throw error;
  return data[0];
};

// Obtener historial por DNI
const getHistorialPorDni = async (dni) => {
  await validarPersonaExiste(dni);

  const { data, error } = await supabase
    .from("historial")
    .select("*")
    .eq("dni", dni)
    .order("fecha_carga", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Obtener historial por ID
const getHistorialPorId = async (id) => {
  const { data, error } = await supabase
    .from("historial")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code === "PGRST116") {
    const err = new Error(`El historial con id ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (error) throw error;
  return data;
};

// Actualizar historial (parcial)
const actualizarHistorial = async (id, campos) => {
  const { data: existente, error: errCheck } = await supabase
    .from("historial")
    .select("id")
    .eq("id", id)
    .single();

  if (errCheck && errCheck.code === "PGRST116") {
    const err = new Error(`El historial con id ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (errCheck) throw errCheck;

  const { data, error } = await supabase
    .from("historial")
    .update(campos)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Eliminar historial
const eliminarHistorial = async (id) => {
  const { data: existente, error: errCheck } = await supabase
    .from("historial")
    .select("id")
    .eq("id", id)
    .single();

  if (errCheck && errCheck.code === "PGRST116") {
    const err = new Error(`El historial con id ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (errCheck) throw errCheck;

  const { error } = await supabase.from("historial").delete().eq("id", id);
  if (error) throw error;

  return { message: "Historial eliminado correctamente" };
};

module.exports = {
  createHistorial,
  getHistorialPorDni,
  getHistorialPorId,
  actualizarHistorial,
  eliminarHistorial,
};
