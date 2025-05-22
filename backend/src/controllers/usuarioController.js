const supabase = require('../config/db');
const bcrypt = require('bcryptjs');

// Crear usuario (solo admin)
const createUsuario = async (req, res) => {
  const { nombre, contraseña, id_entidad, id_rol } = req.body;

  const hashedPassword = await bcrypt.hash(contraseña, 10);

  const { data, error } = await supabase
    .from('usuario')
    .insert([{ nombre, contraseña: hashedPassword, id_entidad, id_rol }]).select();

  if (error) return res.status(500).json({ message: 'Error al crear usuario', error });
  res.status(201).json(data[0]);
};

// Obtener usuario por ID con info de entidad y rol
const getUsuarioById = async (req, res) => {
  const { id } = req.params;

  const { data: usuario, error } = await supabase
    .from('usuario')
    .select('id, nombre, entidad(nombre, servicio_local, descripcion), rol(nombre_rol)')
    .eq('id', id)
    .single();

  if (error || !usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado', error });
  }

  res.json(usuario);
};

// Actualizar usuario (solo admin)
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, contraseña, id_entidad, id_rol } = req.body;

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

  if (error || !data) return res.status(500).json({ message: 'Error al actualizar usuario', error });
  res.json(data);
};

// Eliminar usuario (solo admin)
const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('usuario').delete().eq('id', id);

  if (error) return res.status(500).json({ message: 'Error al eliminar usuario', error });
  res.json({ message: 'Usuario eliminado' });
};

module.exports = {
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
};
