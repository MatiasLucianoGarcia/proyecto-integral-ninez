const supabase = require('../config/db');

const validarEquipoLocalExiste = async (id_equipo) => {
  if (!id_equipo) return;
  const { data, error } = await supabase
    .from('equipo_local')
    .select('id')
    .eq('id', id_equipo)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`El equipo local con id ${id_equipo} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarEquipoLocalExiste };
