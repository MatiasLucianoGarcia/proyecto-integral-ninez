const supabase = require("../config/db"); // <-- igual que en tus services

const validarPersonaExiste = async (dni) => {
  const { data, error } = await supabase
    .from("persona")
    .select("dni")
    .eq("dni", dni)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    const err = new Error(`La persona con DNI ${dni} no existe`);
    err.status = 400;
    throw err;
  }
};

module.exports = { validarPersonaExiste };
