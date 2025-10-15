const supabase = require('../config/db');

const validarIngresoProgramaExiste = async (id_ingreso) => {
  const { data, error } = await supabase
    .from('ingreso_programa')
    .select('id')
    .eq('id', id_ingreso)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (!data) {
    const err = new Error(`El ingreso con ID ${id_ingreso} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarIngresoProgramaExiste };
