const supabase = require('../config/db');
const bcrypt = require('bcryptjs');
const { validarRolExiste } = require("../helpers/rolHelper");
const { validarEntidadExiste } = require("../helpers/entidadHelper");

// Crear usuario
const createUsuario = async ({ nombre, contraseña, id_entidad, id_rol }) => {
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

// Obtener usuario por ID
const getUsuarioById = async (id) => {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, nombre, entidad(nombre, servicio_local, descripcion), rol(nombre_rol)')
    .eq('id', id)
    .single();

  // Si no existe, mensaje personalizado
  if (error && error.code === 'PGRST116') {
    const err = new Error(`El usuario con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (error) throw error;
  return data;
};

// Actualizar usuario
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

  // Si el usuario no existe
  if (error && error.code === 'PGRST116') {
    const err = new Error(`El usuario con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (error) throw error;
  return data;
};

// Eliminar usuario
const deleteUsuario = async (id) => {
  // Verificar si el usuario existe antes de eliminar
  const { data: existe, error: checkError } = await supabase
    .from('usuario')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError && checkError.code === 'PGRST116') {
    const err = new Error(`El usuario con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }

  if (checkError) throw checkError;

  const { error } = await supabase.from('usuario').delete().eq('id', id);
  if (error) throw error;
};

module.exports = {
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
};
