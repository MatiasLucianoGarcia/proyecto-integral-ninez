const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');
const { validarParentezcoExiste } = require("../helpers/parentezcoHelper");

// Consultar familia por dni
const obtenerFamiliaPorDni = async (dni) => {
  const { data, error } = await supabase
    .from('familia')
    .select(`
      id,
      dni_p1,
      dni_p2,
      parentezco:parentezco(descripcion),
      observaciones
    `)
    .or(`dni_p1.eq.${dni},dni_p2.eq.${dni}`);

  if (error) throw error;
  return data;
};

const crearFamilia = async ({ dni_p1, dni_p2, id_parentezco, observaciones }) => {
  // Validar que ambos DNIs existan
  await validarPersonaExiste(dni_p1);
  await validarPersonaExiste(dni_p2);

  // Validar que el parentezco exista
  await validarParentezcoExiste(id_parentezco);

  // Chequeo de duplicados (tanto p1-p2 como p2-p1)
  const { data: existente, error: errorCheck } = await supabase
    .from("familia")
    .select("*")
    .or(
      `and(dni_p1.eq.${dni_p1},dni_p2.eq.${dni_p2}),and(dni_p1.eq.${dni_p2},dni_p2.eq.${dni_p1})`
    );

  if (errorCheck) throw errorCheck;
  if (existente.length > 0) {
    const err = new Error("La relación familiar ya existe");
    err.status = 400;
    throw err;
  }

  // Crear nuevo registro
  const { data, error } = await supabase
    .from("familia")
    .insert([{ dni_p1, dni_p2, id_parentezco, observaciones }])
    .select();

  if (error) throw error;
  return data[0];
};

// Actualizar familia
const actualizarFamilia = async (id, campos) => {
  const { data, error } = await supabase
    .from('familia')
    .update(campos)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Borrar familia
const eliminarFamilia = async (id) => {
  const { error } = await supabase.from('familia').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  obtenerFamiliaPorDni,
  crearFamilia,
  actualizarFamilia,
  eliminarFamilia,
};