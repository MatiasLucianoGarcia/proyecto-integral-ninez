const supabase = require('../config/db');
const bcrypt = require('bcryptjs');
const { validarRolExiste } = require("../helpers/rolHelper");
const { validarEntidadExiste } = require("../helpers/entidadHelper");

const createUsuario = async ({ nombre, contraseña, id_entidad, id_rol }) => {
  // Validar existencia de rol y entidad
  await validarRolExiste(id_rol);
  await validarEntidadExiste(id_entidad);

  const hashedPassword = await bcrypt.hash(contraseña, 10);

  const { data, error } = await supabase
    .from("usuario")
    .insert([{ nombre, contraseña: hashedPassword, id_entidad, id_rol }])
    .select();

  if (error) throw error;
  return data[0];
};


const getUsuarioById = async (id) => {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, nombre, entidad(nombre, servicio_local, descripcion), rol(nombre_rol)')
    .eq('id', id)
    .single();

  if (error || !data) throw { status: 404, message: 'Usuario no encontrado', error };
  return data;
};

const updateUsuario = async (id, { nombre, contraseña, id_entidad, id_rol }) => {
  let updateFields = { nombre, id_entidad, id_rol };

  if (contraseña) {
    updateFields.contraseña = await bcrypt.hash(contraseña, 10);
  }

  const { data, error } = await supabase
    .from('usuario')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) throw error;
  return data;
};

const deleteUsuario = async (id) => {
  const { error } = await supabase.from('usuario').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
};
