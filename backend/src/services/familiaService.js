const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');
const { validarParentezcoExiste } = require('../helpers/parentezcoHelper');

const uniq = arr => [...new Set(arr.filter(Boolean))];

// Obtener familia por DNI
const obtenerFamiliaPorDni = async (dni) => {
  await validarPersonaExiste(dni);

  const { data: relaciones, error } = await supabase
    .from('familia')
    .select(`
      id,
      dni_origen,
      dni_destino,
      observaciones,
      parentezco:parentezco(
        id,
        descripcion,
        id_inverso
      )
    `)
    .or(`dni_origen.eq.${dni},dni_destino.eq.${dni}`);

  if (error) throw error;
  if (!relaciones || relaciones.length === 0) return [];

  // 🧠 agrupar por "el otro DNI" (evita duplicados)
  const relacionesPorPersona = {};

  for (const r of relaciones) {
    const soyOrigen = r.dni_origen === dni;
    const otroDni = soyOrigen ? r.dni_destino : r.dni_origen;

    // si ya tenemos una relación con esa persona, ignoramos la otra
    if (relacionesPorPersona[otroDni]) continue;

    let parentezcoFinal;

    if (soyOrigen) {
      // yo soy origen → el otro es el INVERSO
      parentezcoFinal = r.parentezco.id_inverso
        ? { id: r.parentezco.id_inverso, descripcion: null }
        : null;
    } else {
      // yo soy destino → el otro es TAL CUAL
      parentezcoFinal = {
        id: r.parentezco.id,
        descripcion: r.parentezco.descripcion,
      };
    }

    relacionesPorPersona[otroDni] = {
      id: r.id,
      otroDni,
      parentezco: parentezcoFinal,
      observaciones: r.observaciones,
    };
  }

  const otrosDni = Object.keys(relacionesPorPersona).map(Number);

  const { data: personas, error: errPers } = await supabase
    .from('persona')
    .select(`
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero(id,nombre),
      nacionalidad(id,nombre)
    `)
    .in('dni', otrosDni);

  if (errPers) throw errPers;

  const personasByDni = personas.reduce((acc, p) => {
    acc[p.dni] = p;
    return acc;
  }, {});

  // completar descripcion si vino por inverso
  for (const rel of Object.values(relacionesPorPersona)) {
    if (rel.parentezco && rel.parentezco.descripcion === null) {
      const { data } = await supabase
        .from('parentezco')
        .select('id, descripcion')
        .eq('id', rel.parentezco.id)
        .single();

      rel.parentezco = data;
    }
  }

  return Object.values(relacionesPorPersona).map(r => ({
    id: r.id,
    persona: personasByDni[r.otroDni],
    parentezco: r.parentezco,
    observaciones: r.observaciones,
  }));
};

// Crear familia (inserta directa + inversa)
const crearFamilia = async ({ dni_origen, dni_destino, id_parentezco, observaciones }) => {
  await validarPersonaExiste(dni_origen);
  await validarPersonaExiste(dni_destino);
  await validarParentezcoExiste(id_parentezco);

  // 🔍 traer parentezco e inverso
  const { data: parentezco, error: errPar } = await supabase
    .from('parentezco')
    .select('id, id_inverso')
    .eq('id', id_parentezco)
    .single();

  if (errPar) throw errPar;
  if (!parentezco.id_inverso) {
    const err = new Error('El parentezco no tiene inverso definido');
    err.status = 400;
    throw err;
  }

  // 🔍 verificar si ya existe en CUALQUIER sentido
  const { data: existente, error: errExiste } = await supabase
    .from('familia')
    .select('id')
    .or(
      `and(dni_origen.eq.${dni_origen},dni_destino.eq.${dni_destino}),` +
      `and(dni_origen.eq.${dni_destino},dni_destino.eq.${dni_origen})`
    );

  if (errExiste) throw errExiste;

  if (existente.length > 0) {
    const err = new Error('La relación familiar ya existe');
    err.status = 400;
    throw err;
  }

  // 🧩 crear ambas relaciones
  const inserts = [
    {
      dni_origen,
      dni_destino,
      id_parentezco: parentezco.id,
      observaciones,
    },
    {
      dni_origen: dni_destino,
      dni_destino: dni_origen,
      id_parentezco: parentezco.id_inverso,
      observaciones,
    },
  ];

  const { data, error } = await supabase
    .from('familia')
    .insert(inserts)
    .select();

  if (error) throw error;

  return data;
};

// Actualizar familia
const actualizarFamilia = async (id, campos) => {
  const { data: existe, error: errCheck } = await supabase
    .from('familia')
    .select('id')
    .eq('id', id);

  if (errCheck) throw errCheck;

  if (!existe || existe.length === 0) {
    const err = new Error('Relación familiar inexistente');
    err.status = 404;
    throw err;
  }

  const { data, error } = await supabase
    .from('familia')
    .update(campos)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};


// Eliminar familia (borra directa + inversa)
const eliminarFamilia = async (id) => {
  const { data: relacion, error: errRel } = await supabase
    .from('familia')
    .select('dni_origen, dni_destino')
    .eq('id', id);

  if (errRel) throw errRel;

  if (!relacion || relacion.length === 0) {
    const err = new Error('Relación familiar inexistente');
    err.status = 404;
    throw err;
  }

  const { dni_origen, dni_destino } = relacion[0];

  const { error: errDelete } = await supabase
    .from('familia')
    .delete()
    .or(
      `and(dni_origen.eq.${dni_origen},dni_destino.eq.${dni_destino}),` +
      `and(dni_origen.eq.${dni_destino},dni_destino.eq.${dni_origen})`
    );

  if (errDelete) throw errDelete;

  return {
    message: 'Relación familiar eliminada correctamente (directa e inversa)',
  };
};

// Sugerir familia (queda casi igual)
const sugerirFamilia = async (dni) => {
  await validarPersonaExiste(dni);

  const { data: rels } = await supabase
    .from('familia')
    .select('dni_destino')
    .eq('dni_origen', dni);

  const conocidos = rels.map(r => r.dni_destino);
  if (conocidos.length === 0) return [];

  const { data: posibles } = await supabase
    .from('familia')
    .select('dni_destino')
    .in('dni_origen', conocidos);

  const sugeridos = uniq(posibles.map(p => p.dni_destino))
    .filter(d => d !== dni && !conocidos.includes(d));

  if (sugeridos.length === 0) return [];

  const { data: personas } = await supabase
    .from('persona')
    .select(`
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero(id,nombre),
      nacionalidad(id,nombre)
    `)
    .in('dni', sugeridos);

  return personas;
};

module.exports = {
  obtenerFamiliaPorDni,
  crearFamilia,
  actualizarFamilia,
  eliminarFamilia,
  sugerirFamilia,
};
