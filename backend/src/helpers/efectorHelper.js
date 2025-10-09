const supabase = require('../config/db');

const validarEfectorExiste = async (id_efector) => {
  if (!id_efector) return; // puede ser null o no enviado
  const { data, error } = await supabase
    .from('efector')
    .select('id')
    .eq('id', id_efector)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`El efector con id ${id_efector} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarEfectorExiste };
