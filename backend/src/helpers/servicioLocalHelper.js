const supabase = require('../config/db');

const validarServicioLocalExiste = async (id) => {
  const { data, error } = await supabase
    .from('servicio_local')
    .select('id')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (!data) {
    const err = new Error(`El ingreso al servicio local con ID ${id} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarServicioLocalExiste };
