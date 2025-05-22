const supabase = require('../config/db'); // Cliente de Supabase
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  const { nombre, contraseña } = req.body;

  try {
    // Obtener el usuario desde Supabase
    const { data: user, error } = await supabase
      .from('usuario') // Tabla usuario
      .select('*')
      .eq('nombre', nombre)
      .single(); // Solo un usuario esperado

    if (error || !user) {
      console.error('Error al obtener usuario:', error);
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña con la almacenada
    const validPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Verificar si el usuario tiene rol asignado
    if (!user.id_rol) {
      return res.status(400).json({ message: 'El usuario no tiene un rol asignado' });
    }

    // Buscar el nombre del rol
    const { data: rolData, error: rolError } = await supabase
      .from('rol') // Tabla Rol
      .select('nombre_rol') // Nombre correcto de la columna
      .eq('id', user.id_rol)
      .single();

    if (rolError || !rolData) {
      console.error('Error al obtener rol:', rolError);
      return res.status(500).json({ message: 'Error al obtener rol del usuario' });
    }

    const rol = rolData.nombre_rol;

    // Generar token con datos del usuario
    const token = generateToken({ id: user.id, rol, nombre: user.nombre });

    res.json({ token });
  } catch (error) {
    console.error('Error interno:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login };
