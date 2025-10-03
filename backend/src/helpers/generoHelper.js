const supabase = require("../config/db");

const validarGeneroExiste = async (id_genero) => {
  const { data, error } = await supabase
    .from("genero")
    .select("id")
    .eq("id", id_genero)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    const err = new Error(`El género con id ${id_genero} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarGeneroExiste };
