const supabase = require("../config/db");

const validarRolExiste = async (id) => {
  const { data, error } = await supabase
    .from("rol")
    .select("id")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    const err = new Error(`El rol con id ${id} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarRolExiste };
