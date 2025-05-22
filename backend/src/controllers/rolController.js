const supabase = require('../config/db');

// Crear un nuevo rol
const crearRol = async (req, res) => {
  const { nombre_rol } = req.body;

  const { data, error } = await supabase
    .from('rol')
    .insert([{ nombre_rol }])
    .select();

  if (error) {
    return res.status(500).json({ message: 'Error al crear rol', error });
  }

  res.status(201).json(data[0]);
};

// Obtener todos los roles
const obtenerRoles = async (req, res) => {
  const { data, error } = await supabase.from('rol').select('*');

  if (error) return res.status(500).json({ message: 'Error al obtener roles', error });

  res.json(data);
};

// Actualizar un rol
const actualizarRol = async (req, res) => {
  const { id } = req.params;
  const { nombre_rol } = req.body;

  const { data, error } = await supabase
    .from('rol')
    .update({ nombre_rol })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ message: 'Error al actualizar rol', error });

  res.json(data[0]);
};

// Eliminar un rol
const eliminarRol = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('rol').delete().eq('id', id);

  if (error) return res.status(500).json({ message: 'Error al eliminar rol', error });

  res.json({ message: 'Rol eliminado' });
};

module.exports = {
  crearRol,
  obtenerRoles,
  actualizarRol,
  eliminarRol,
};
