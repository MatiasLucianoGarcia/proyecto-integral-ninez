const supabase = require('../config/db');
const { validarPersonaExiste } = require('../helpers/personaHelper');
const { validarParentezcoExiste } = require('../helpers/parentezcoHelper');

const uniq = (arr) => [...new Set(arr.filter(Boolean))];

// Consultar familia por dni
const obtenerFamiliaPorDni = async (dni) => {
  await validarPersonaExiste(Number(dni));

  const { data: familias, error } = await supabase
    .from('familia')
    .select(`
      id,
      dni_p1,
      dni_p2,
      id_parentezco1,
      id_parentezco2,
      observaciones
    `)
    .or(`dni_p1.eq.${dni},dni_p2.eq.${dni}`);

  if (error) throw error;
  if (!familias || familias.length === 0) return [];

  const otros = uniq(
    familias.map(f => (f.dni_p1 === Number(dni) ? f.dni_p2 : f.dni_p1))
  );

  const { data: personasData, error: errPersonas } = await supabase
    .from('persona')
    .select(`
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero(id,nombre),
      nacionalidad(id,nombre)
    `)
    .in('dni', otros);

  if (errPersonas) throw errPersonas;

  const personasByDni = (personasData || []).reduce((acc, p) => {
    acc[p.dni] = p;
    return acc;
  }, {});

  const parentezcoIds = uniq(
    familias.map(f => (f.dni_p1 === Number(dni) ? f.id_parentezco2 : f.id_parentezco1))
  ).filter(Boolean);

  let parentezcosById = {};
  if (parentezcoIds.length > 0) {
    const { data: pares, error: errPar } = await supabase
      .from('parentezco')
      .select('id, descripcion')
      .in('id', parentezcoIds);

    if (errPar) throw errPar;
    parentezcosById = (pares || []).reduce((acc, p) => {
      acc[p.id] = p.descripcion;
      return acc;
    }, {});
  }

  const resultado = familias.map(f => {
    const soyP1 = f.dni_p1 === Number(dni);
    const dniContrario = soyP1 ? f.dni_p2 : f.dni_p1;
    const persona = personasByDni[dniContrario] || { dni: dniContrario };

    const parentezcoId = soyP1 ? f.id_parentezco2 : f.id_parentezco1;
    const parentezcoDescripcion = parentezcosById[parentezcoId] || null;

    return {
      id: f.id,
      persona,
      parentezco: {
        id: parentezcoId,
        descripcion: parentezcoDescripcion,
      },
      observaciones: f.observaciones,
    };
  });

  return resultado;
};

// Crear familia
const crearFamilia = async ({ dni_p1, dni_p2, id_parentezco1, id_parentezco2, observaciones }) => {
  await validarPersonaExiste(dni_p1);
  await validarPersonaExiste(dni_p2);
  await validarParentezcoExiste(id_parentezco1);
  await validarParentezcoExiste(id_parentezco2);

  const { data: existente, error: errorCheck } = await supabase
    .from('familia')
    .select('id')
    .or(
      `and(dni_p1.eq.${dni_p1},dni_p2.eq.${dni_p2}),and(dni_p1.eq.${dni_p2},dni_p2.eq.${dni_p1})`
    );

  if (errorCheck) throw errorCheck;
  if (existente && existente.length > 0) {
    const err = new Error('La relación familiar ya existe');
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from('familia')
    .insert([{ dni_p1, dni_p2, id_parentezco1, id_parentezco2, observaciones }])
    .select();

  if (error) throw error;
  return data[0];
};

// Actualizar familia
const actualizarFamilia = async (id, campos) => {
  const { data: existe, error: errCheck } = await supabase
    .from('familia')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`La relación familiar con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { data, error } = await supabase
    .from('familia')
    .update(campos)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Eliminar familia
const eliminarFamilia = async (id) => {
  const { data: existe, error: errCheck } = await supabase
    .from('familia')
    .select('id')
    .eq('id', id)
    .single();

  if (errCheck && errCheck.code === 'PGRST116') {
    const err = new Error(`La relación familiar con ID ${id} no existe`);
    err.status = 404;
    throw err;
  }
  if (errCheck) throw errCheck;

  const { error } = await supabase.from('familia').delete().eq('id', id);
  if (error) throw error;

  return { message: 'Relación familiar eliminada correctamente' };
};

// Sugerir familia
const sugerirFamilia = async (dni) => {
  await validarPersonaExiste(Number(dni));

  const { data: familiares1, error: errorF1 } = await supabase
    .from('familia')
    .select('dni_p1, dni_p2')
    .or(`dni_p1.eq.${dni},dni_p2.eq.${dni}`);

  if (errorF1) throw errorF1;

  const idsFamiliares1 = uniq(familiares1.map(f => (f.dni_p1 === Number(dni) ? f.dni_p2 : f.dni_p1)));

  if (idsFamiliares1.length === 0) return [];

  const orExpr = idsFamiliares1.map(fid => `dni_p1.eq.${fid},dni_p2.eq.${fid}`).join(',');
  const { data: familias2, error: errorF2 } = await supabase
    .from('familia')
    .select('dni_p1, dni_p2')
    .or(orExpr);

  if (errorF2) throw errorF2;

  const idsFamiliares2 = uniq(familias2.map(f => [f.dni_p1, f.dni_p2]).flat());
  let posibles = idsFamiliares2.filter(id => id !== Number(dni) && !idsFamiliares1.includes(id));
  posibles = uniq(posibles);

  if (posibles.length === 0) return [];

  const orRel = posibles
    .map(fid => `and(dni_p1.eq.${dni},dni_p2.eq.${fid}),and(dni_p1.eq.${fid},dni_p2.eq.${dni})`)
    .join(',');
  const { data: relacionesExistentes, error: errorRel } = await supabase
    .from('familia')
    .select('dni_p1, dni_p2')
    .or(orRel);

  if (errorRel) throw errorRel;

  const yaRelacionados = relacionesExistentes.map(r => (r.dni_p1 === Number(dni) ? r.dni_p2 : r.dni_p1));
  const finales = posibles.filter(id => !yaRelacionados.includes(id) && id !== Number(dni));

  if (finales.length === 0) return [];

  const { data: personas, error: errPersonas } = await supabase
    .from('persona')
    .select(`
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero(id,nombre),
      nacionalidad(id,nombre)
    `)
    .in('dni', finales);

  if (errPersonas) throw errPersonas;
  return personas;
};

module.exports = {
  obtenerFamiliaPorDni,
  crearFamilia,
  actualizarFamilia,
  eliminarFamilia,
  sugerirFamilia,
};
