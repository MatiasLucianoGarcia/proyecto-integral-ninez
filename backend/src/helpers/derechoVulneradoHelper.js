const supabase = require('../config/db');

const validarDerechoVulneradoExiste = async (id_derecho) => {
  if (!id_derecho) return;
  const { data, error } = await supabase
    .from('derecho_vulnerado')
    .select('id')
    .eq('id', id_derecho)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`El derecho vulnerado con id ${id_derecho} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarDerechoVulneradoExiste };
