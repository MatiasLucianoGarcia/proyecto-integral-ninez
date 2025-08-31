const supabase = require('../config/db');

const createHistorial = async ({ dni, intervencion, resultado, fecha_carga }) => {
  const { data, error } = await supabase
    .from('historial')
    .insert([{ dni, intervencion, resultado, fecha_carga }])
    .select();

  if (error) throw error;
  return data[0];
};

module.exports = {
  createHistorial
};
