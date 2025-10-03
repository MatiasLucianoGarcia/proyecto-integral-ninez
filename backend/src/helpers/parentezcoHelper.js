const supabase = require("../config/db");

const validarParentezcoExiste = async (id_parentezco) => {
  const { data, error } = await supabase
    .from("parentezco")
    .select("id")
    .eq("id", id_parentezco)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    const err = new Error(`El parentezco con id ${id_parentezco} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarParentezcoExiste };
