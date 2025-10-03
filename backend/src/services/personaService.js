const supabase = require('../config/db');
const { validarGeneroExiste } = require("../helpers/generoHelper");
const { validarNacionalidadExiste } = require("../helpers/nacionalidadHelper");

const getPersonas = async () => {
  const { data, error } = await supabase
    .from('persona')
    .select(`
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero(nombre),
      nacionalidad(nombre)
    `);

  if (error) throw error;
  return data;
};

const createPersona = async ({ dni, nombre, apellido, fecha_nacimiento, id_genero, id_nacionalidad }) => {
  // Validar que existan genero y nacionalidad
  await validarGeneroExiste(id_genero);
  await validarNacionalidadExiste(id_nacionalidad);

  const { data, error } = await supabase
    .from("persona")
    .insert([{ dni, nombre, apellido, fecha_nacimiento, id_genero, id_nacionalidad }])
    .select();

  if (error) throw error;
  return data[0];
};


const updatePersona = async (dni, { nombre, apellido, fecha_nacimiento, id_genero, id_nacionalidad }) => {
  const { data, error } = await supabase
    .from('persona')
    .update({ nombre, apellido, fecha_nacimiento, id_genero, id_nacionalidad })
    .eq('dni', dni)
    .select()
    .single();

  if (error || !data) throw error;
  return data;
};

const deletePersona = async (dni) => {
  const { error } = await supabase.from('persona').delete().eq('dni', dni);
  if (error) throw error;
};

module.exports = {
  getPersonas,
  createPersona,
  updatePersona,
  deletePersona,
};
