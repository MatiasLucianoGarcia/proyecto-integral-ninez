const supabase = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const loginUser = async ({ nombre, contraseña }) => {
  // Buscar el usuario
  const { data: user, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('nombre', nombre)
    .single();

  if (error || !user) {
    throw new Error('Usuario no encontrado');
  }

  // Validar contraseña
  const validPassword = await bcrypt.compare(contraseña, user.contraseña);
  if (!validPassword) {
    throw new Error('Contraseña incorrecta');
  }

  if (!user.id_rol) {
    throw new Error('El usuario no tiene un rol asignado');
  }

  // Obtener el nombre del rol
  const { data: rolData, error: rolError } = await supabase
    .from('rol')
    .select('nombre_rol')
    .eq('id', user.id_rol)
    .single();

  if (rolError || !rolData) {
    throw new Error('Error al obtener rol del usuario');
  }

  const rol = rolData.nombre_rol;

  // Generar token
  const token = generateToken({ id: user.id, rol, nombre: user.nombre });

  return token;
};

module.exports = {
  loginUser,
};
