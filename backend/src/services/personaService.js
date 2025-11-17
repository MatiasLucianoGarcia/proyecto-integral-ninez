const supabase = require("../config/db");
const { validarGeneroExiste } = require("../helpers/generoHelper");
const { validarNacionalidadExiste } = require("../helpers/nacionalidadHelper");

// Obtener todas las personas
const getPersonas = async () => {
  const { data, error } = await supabase.from("persona").select(`
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero(nombre),
      nacionalidad(nombre)
    `);

  if (error) throw error;
  return data;
};

// Crear persona
const createPersona = async ({
  dni,
  nombre,
  apellido,
  fecha_nacimiento,
  id_genero,
  id_nacionalidad,
}) => {
  await validarGeneroExiste(id_genero);
  await validarNacionalidadExiste(id_nacionalidad);

  const { data, error } = await supabase
    .from("persona")
    .insert([
      { dni, nombre, apellido, fecha_nacimiento, id_genero, id_nacionalidad },
    ])
    .select();

  // Si el DNI ya existe
  if (error && error.code === "23505") {
    const err = new Error(`La persona con DNI ${dni} ya está registrada`);
    err.status = 400;
    throw err;
  }

  if (error) throw error;
  return data[0];
};

// Actualizar persona
const updatePersona = async (
  dni,
  { nombre, apellido, fecha_nacimiento, id_genero, id_nacionalidad }
) => {
  try {
    if (id_genero) await validarGeneroExiste(id_genero);
    if (id_nacionalidad) await validarNacionalidadExiste(id_nacionalidad);

    const { data, error } = await supabase
      .from("persona")
      .update({
        nombre,
        apellido,
        fecha_nacimiento,
        id_genero,
        id_nacionalidad,
      })
      .eq("dni", dni)
      .select()
      .single();

    if (error && error.code === "PGRST116") {
      const err = new Error(`La persona con DNI ${dni} no existe`);
      err.status = 404;
      throw err;
    }

    if (error && error.code === "23503") {
      if (error.message.includes("persona_id_genero_fkey")) {
        const generoId = id_genero ?? "(desconocido)";
        const err = new Error(`El género con ID ${generoId} no existe`);
        err.status = 400;
        throw err;
      }

      if (error.message.includes("persona_id_nacionalidad_fkey")) {
        const nacId = id_nacionalidad ?? "(desconocido)";
        const err = new Error(`La nacionalidad con ID ${nacId} no existe`);
        err.status = 400;
        throw err;
      }
    }

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// Eliminar persona
const deletePersona = async (dni) => {
  const { data: existente, error: errCheck } = await supabase
    .from("persona")
    .select("dni")
    .eq("dni", dni)
    .single();

  if (errCheck && errCheck.code === "PGRST116") {
    const err = new Error(`La persona con DNI ${dni} no existe`);
    err.status = 404;
    throw err;
  }

  if (errCheck) throw errCheck;

  const { error } = await supabase.from("persona").delete().eq("dni", dni);
  if (error) throw error;

  return { message: "Persona eliminada correctamente" };
};

const getPersonaByDNI = async (dni) => {
  const { data, error } = await supabase
    .from("persona")
    .select(
      `
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero(nombre),
      nacionalidad(nombre)
    `
    )
    .eq("dni", dni)
    .single();
  if (error) throw error;
  return data;
};

// Buscar personas por coincidencia parcial de DNI o nombre
const searchPersonas = async (filtros) => {
  if (!filtros?.dni && !filtros?.nombre) {
    return [];
  }

  let query = supabase.from("persona").select(`
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero(nombre),
      nacionalidad(nombre)
    `);

  if (filtros?.dni) {
    const dniPrefix = parseInt(filtros.dni, 10);
    if (!isNaN(dniPrefix)) {
      const dniLength = filtros.dni.length;
      const dniUpperBound = (dniPrefix + 1) * Math.pow(10, 9 - dniLength); // Calcular límite superior del rango
      query = query.gte("dni", dniPrefix).lt("dni", dniUpperBound); // Buscar en el rango de prefijo
    } else {
      throw new Error("El valor de DNI debe ser numérico.");
    }
  }

  if (filtros?.nombre) {
    query = query.ilike("nombre", `%${filtros.nombre}%`); // Aplicar filtro para nombre
  }

  // Ejecutar la consulta y manejar errores
  const { data, error } = await query;

  if (error) {
    console.error("Error en la consulta de searchPersonas:", error);
    throw error;
  }

  console.log("Resultados de searchPersonas:", data);

  return data;
};

module.exports = {
  getPersonas,
  createPersona,
  updatePersona,
  deletePersona,
  getPersonaByDNI,
  searchPersonas,
};
