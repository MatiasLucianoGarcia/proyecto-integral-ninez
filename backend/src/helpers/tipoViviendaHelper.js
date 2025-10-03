const supabase = require("../config/db");

const validarTipoViviendaExiste = async (id_tipo) => {
  const { data, error } = await supabase
    .from("tipo_vivienda")
    .select("id")
    .eq("id", id_tipo)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    const err = new Error(`El tipo de vivienda con id ${id_tipo} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarTipoViviendaExiste };
