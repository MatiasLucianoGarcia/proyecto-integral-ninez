const supabase = require('../config/db');

const validarProgramaExiste = async (id_programa) => {
  const { data, error } = await supabase
    .from('programa')
    .select('id')
    .eq('id', id_programa)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`No hay ningun programa con ese id`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarProgramaExiste };
