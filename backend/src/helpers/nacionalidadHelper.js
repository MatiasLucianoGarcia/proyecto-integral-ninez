const supabase = require("../config/db");

const validarNacionalidadExiste = async (id_nacionalidad) => {
  const { data, error } = await supabase
    .from("nacionalidad")
    .select("id")
    .eq("id", id_nacionalidad)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    const err = new Error(`La nacionalidad con id ${id_nacionalidad} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarNacionalidadExiste };
