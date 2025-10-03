const supabase = require("../config/db");

const validarEntidadExiste = async (id) => {
  const { data, error } = await supabase
    .from("entidad")
    .select("id")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    const err = new Error(`La entidad con id ${id} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarEntidadExiste };
