const supabase = require('../config/db');

const obtenerReporteEscolaridad = async (anio, minEdad = 5, maxEdad = 21, generos = [], nacionalidades = []) => {
    // Convertir anio a entero por seguridad
    const anioNum = parseInt(anio, 10);
    const minEdadNum = parseInt(minEdad, 10);
    const maxEdadNum = parseInt(maxEdad, 10);

    if (isNaN(anioNum)) {
        throw new Error('El año debe ser un número válido');
    }

    // 1. Obtener escolaridad para el año
    // Prioridad: fecha_real, si no fecha_carga
    // Buscamos registros donde fecha_real o fecha_carga caigan en el año seleccionado

    const start = `${anioNum}-01-01T00:00:00`;
    const end = `${anioNum + 1}-01-01T00:00:00`;

    const { data: rawData, error: errorEsc } = await supabase
        .from('escolaridad')
        .select(`
            dni,
            nivel,
            fecha_carga,
            fecha_real
        `)
        .or(`and(fecha_real.gte.${start},fecha_real.lt.${end}),and(fecha_carga.gte.${start},fecha_carga.lt.${end})`);

    if (errorEsc) throw errorEsc;

    // 2. Obtener TODAS las personas para base poblacional
    const { data: personas, error: errorPer } = await supabase
        .from('persona')
        .select(`
            dni, 
            fecha_nacimiento, 
            generoObj:genero(nombre), 
            nacionalidadObj:nacionalidad(nombre)
        `);

    if (errorPer) throw errorPer;

    // 3. Procesar: Crear mapa de escolaridad por DNI para acceso rápido
    // Filtramos en memoria para asegurar que la "fecha efectiva" corresponda al año
    const escolaridadMap = new Map();
    rawData.forEach(reg => {
        // Determinar fecha efectiva
        const fechaEfectiva = reg.fecha_real ? new Date(reg.fecha_real) : new Date(reg.fecha_carga);

        // Si la fecha efectiva cae en el año solicitado, lo usamos
        if (fechaEfectiva.getFullYear() === anioNum) {
            escolaridadMap.set(reg.dni, reg);
        }
    });

    // Cálculo de la fecha de referencia para la edad
    const anioActual = new Date().getFullYear();
    let fechaReferencia;

    if (anioNum === anioActual) {
        fechaReferencia = new Date(); // Hoy
    } else {
        fechaReferencia = new Date(anioNum, 11, 31); // 31 de Diciembre
    }

    // 4. Calcular edades y status para cada persona
    const reporte = {};
    const reporteGenero = {};
    const reporteNacionalidad = {};

    personas.forEach((persona) => {
        if (!persona.fecha_nacimiento) return;

        // FILTROS ---
        const generoNombre = persona.generoObj?.nombre;
        const nacionalidadNombre = persona.nacionalidadObj?.nombre;

        if (generos && generos.length > 0) {
            if (!generoNombre || !generos.includes(generoNombre)) return;
        }

        if (nacionalidades && nacionalidades.length > 0) {
            if (!nacionalidadNombre || !nacionalidades.includes(nacionalidadNombre)) return;
        }
        // -----------

        const fechaNac = new Date(persona.fecha_nacimiento);

        // Cálculo preciso de edad
        let edad = fechaReferencia.getFullYear() - fechaNac.getFullYear();
        const m = fechaReferencia.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && fechaReferencia.getDate() < fechaNac.getDate())) {
            edad--;
        }

        // Filtramos por rango de edad solicitado por el usuario
        if (edad < minEdadNum || edad > maxEdadNum) return;

        // Determinar estado: 
        // Si tienen registro en escolaridad para ese año -> Escolarizado
        // Si NO tienen registro -> No Escolarizado
        let estado = 'No Escolarizado';

        if (escolaridadMap.has(persona.dni)) {
            estado = 'Escolarizado';
        }

        // --- Agregación por Edad ---
        if (!reporte[edad]) {
            reporte[edad] = {
                edad,
                escolarizados: 0,
                no_escolarizados: 0,
                total: 0
            };
        }
        reporte[edad].total += 1;
        if (estado === 'Escolarizado') {
            reporte[edad].escolarizados += 1;
        } else {
            reporte[edad].no_escolarizados += 1;
        }

        // --- Agregación por Género ---
        const gKey = generoNombre || 'No Especificado';
        if (!reporteGenero[gKey]) {
            reporteGenero[gKey] = { label: gKey, escolarizados: 0, no_escolarizados: 0, total: 0 };
        }
        reporteGenero[gKey].total += 1;
        if (estado === 'Escolarizado') reporteGenero[gKey].escolarizados += 1;
        else reporteGenero[gKey].no_escolarizados += 1;

        // --- Agregación por Nacionalidad ---
        const nKey = nacionalidadNombre || 'No Especificada';
        if (!reporteNacionalidad[nKey]) {
            reporteNacionalidad[nKey] = { label: nKey, escolarizados: 0, no_escolarizados: 0, total: 0 };
        }
        reporteNacionalidad[nKey].total += 1;
        if (estado === 'Escolarizado') reporteNacionalidad[nKey].escolarizados += 1;
        else reporteNacionalidad[nKey].no_escolarizados += 1;
    });

    // Convertir objeto a array ordenado por edad
    const por_edad = Object.values(reporte).sort((a, b) => a.edad - b.edad);
    const por_genero = Object.values(reporteGenero);
    const por_nacionalidad = Object.values(reporteNacionalidad);

    return { por_edad, por_genero, por_nacionalidad };
};

const obtenerAniosDisponibles = async () => {
    // Obtenemos todas las fechas de carga para extraer los años
    // Nota: Esto podría optimizarse con SQL raw si la tabla crece mucho, 
    // pero para un MVP está bien procesar en memoria o usar una view.
    const { data, error } = await supabase
        .from('escolaridad')
        .select('fecha_carga, fecha_real');

    if (error) throw error;

    const aniosSet = new Set();
    data.forEach(registro => {
        // Prioridad fecha_real
        const fechaStr = registro.fecha_real || registro.fecha_carga;
        if (fechaStr) {
            const anio = new Date(fechaStr).getFullYear();
            aniosSet.add(anio);
        }
    });

    // Convertir a array y ordenar descendente
    return Array.from(aniosSet).sort((a, b) => b - a);
};

// --- Helper para generar subrangos ---
const generarSubRangos = (min, max) => {
    // FIX: Si min == max, devolvemos un único rango
    if (min === max) {
        return [{ min: min, max: min, label: `${min} años` }];
    }

    const total = max - min;
    const subRangos = [];

    let pasos;
    if (total <= 10) pasos = 2; // e.g. 5-15 -> split 2
    else if (total <= 20) pasos = 3; // e.g 0-20 -> split 3
    else pasos = 4; // > 20 -> split 4

    // Evitar pasos mayor que la diferencia si es muy chica (ej 5-6 años)
    // Si total < pasos, ajustamos pasos a total o 1
    if (total < pasos) pasos = Math.max(1, total);

    const tamaño = Math.ceil(total / pasos);

    let actual = min;
    while (actual < max) {
        let fin = actual + tamaño;
        if (fin > max) fin = max;

        // Ajuste para el último rango si queda muy chico o para cerrar justo
        if (subRangos.length === pasos - 1) fin = max;

        // Validar que no nos pasemos
        if (actual > max) break;

        subRangos.push({ min: actual, max: fin, label: `${actual} - ${fin} años` });
        actual = fin + 1;
    }

    // Safety check: si no se generó nada (ej min=10 max=11 y logica falla), forzamos al menos uno
    if (subRangos.length === 0) {
        subRangos.push({ min: min, max: max, label: `${min} - ${max} años` });
    }

    return subRangos;
};

const obtenerReporteCondicionesVida = async ({ minEdad = 0, maxEdad = 100, generos = [], nacionalidades = [] }) => {
    // 1. Obtener Base de Personas con relaciones
    // 1. Obtener Base de Personas con relaciones
    let query = supabase
        .from('persona')
        .select(`
            dni,
            fecha_nacimiento,
            generoObj:genero(nombre),
            nacionalidadObj:nacionalidad(nombre),
            condiciones:condiciones_vida(*),
            viviendas:vivienda(tipo_vivienda(*))
        `);

    const { data: personas, error } = await query;
    if (error) throw error;

    // 2. Procesamiento en Memoria
    const resultado = {
        global: {
            total_personas: 0,
            sin_agua: 0,
            sin_luz: 0,
            sin_gas: 0,
            sin_internet: 0,
            tipos_vivienda: {}
        },
        por_edad: [],
        por_genero: [],
        por_nacionalidad: []
    };

    // Generar rangos etarios dinámicos
    const subRangos = generarSubRangos(parseInt(minEdad), parseInt(maxEdad));

    // Inicializar grupos por edad
    const gruposEdad = subRangos.map(r => initGroup(r.label, r));
    const gruposGenero = {}; // Dinámico
    const gruposNacionalidad = {}; // Dinámico

    const fechaReferencia = new Date();

    personas.forEach(p => {
        // --- Filtro 1: Edad ---
        if (!p.fecha_nacimiento) return;
        const fechaNac = new Date(p.fecha_nacimiento);
        let edad = fechaReferencia.getFullYear() - fechaNac.getFullYear();
        const m = fechaReferencia.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && fechaReferencia.getDate() < fechaNac.getDate())) {
            edad--;
        }

        if (edad < minEdad || edad > maxEdad) return;

        // --- Obtener Nombres de Genero y Nacionalidad ---
        const generoNombre = p.generoObj?.nombre;
        const nacionalidadNombre = p.nacionalidadObj?.nombre;

        // --- Filtro 2: Género ---
        // generos array vacio implica 'todos'
        if (generos && generos.length > 0) {
            // Si no tiene genero y estamos filtrando, ¿lo excluimos? Asumimos que si.
            if (!generoNombre || !generos.includes(generoNombre)) return;
        }

        // --- Filtro 3: Nacionalidad ---
        // nacionalidades array vacio implica 'todos'
        if (nacionalidades && nacionalidades.length > 0) {
            if (!nacionalidadNombre || !nacionalidades.includes(nacionalidadNombre)) return;
        }

        // --- Procesar Datos ---
        const cond = p.condiciones && p.condiciones.length > 0 ? p.condiciones[0] : null;
        const vivienda = p.viviendas && p.viviendas.length > 0 ? p.viviendas[p.viviendas.length - 1] : null;

        const sinLuz = cond?.acceso_luz === false;
        const sinGas = cond?.acceso_gas === false;
        const sinAgua = cond?.acceso_agua === false;
        const sinInternet = cond?.acceso_internet === false;

        const tipoVivienda = (vivienda && vivienda.tipo_vivienda) ? vivienda.tipo_vivienda.tipo : null;

        // Update Global
        updateStats(resultado.global, sinLuz, sinGas, sinAgua, sinInternet, tipoVivienda);
        resultado.global.total_personas++;

        // Update Por Edad
        const grupoEdad = gruposEdad.find(g => edad >= g.metadata.min && edad <= g.metadata.max);
        if (grupoEdad) {
            updateStats(grupoEdad, sinLuz, sinGas, sinAgua, sinInternet, tipoVivienda);
            grupoEdad.total++;
        }

        // Update Por Genero
        const generoKey = generoNombre || 'No Especificado';
        if (!gruposGenero[generoKey]) gruposGenero[generoKey] = initGroup(generoKey);
        updateStats(gruposGenero[generoKey], sinLuz, sinGas, sinAgua, sinInternet, tipoVivienda);
        gruposGenero[generoKey].total++;

        // Update Por Nacionalidad
        const nacKey = nacionalidadNombre || 'No Especificada';
        if (!gruposNacionalidad[nacKey]) gruposNacionalidad[nacKey] = initGroup(nacKey);
        updateStats(gruposNacionalidad[nacKey], sinLuz, sinGas, sinAgua, sinInternet, tipoVivienda);
        gruposNacionalidad[nacKey].total++;
    });

    // Formatear resultados
    resultado.por_edad = gruposEdad.map(formatGroupResult);
    resultado.por_genero = Object.values(gruposGenero).map(formatGroupResult);
    resultado.por_nacionalidad = Object.values(gruposNacionalidad).map(formatGroupResult);

    // Formatear Globales
    const totalG = resultado.global.total_personas || 1;
    resultado.global.porcentaje_sin_luz = Math.round((resultado.global.sin_luz / totalG) * 100);
    resultado.global.porcentaje_sin_gas = Math.round((resultado.global.sin_gas / totalG) * 100);
    resultado.global.porcentaje_sin_agua = Math.round((resultado.global.sin_agua / totalG) * 100);
    resultado.global.porcentaje_sin_internet = Math.round((resultado.global.sin_internet / totalG) * 100);

    return resultado;
};

// Helper init group
function initGroup(label, metadata = {}) {
    return {
        label, // Used for final display name
        metadata, // Used for internal logic (e.g. range min/max)
        total: 0,
        sin_agua: 0,
        sin_luz: 0,
        sin_gas: 0,
        sin_internet: 0,
        tipos_vivienda: {}
    };
}

// Helper update stats
function updateStats(obj, sinLuz, sinGas, sinAgua, sinInternet, tipoVivienda) {
    if (sinLuz) obj.sin_luz++;
    if (sinGas) obj.sin_gas++;
    if (sinAgua) obj.sin_agua++;
    if (sinInternet) obj.sin_internet++;
    if (tipoVivienda) {
        obj.tipos_vivienda[tipoVivienda] = (obj.tipos_vivienda[tipoVivienda] || 0) + 1;
    }
}

// Helper format result
function formatGroupResult(g) {
    let tipoPredominante = 'N/A';
    let maxCount = 0;
    Object.entries(g.tipos_vivienda).forEach(([tipo, count]) => {
        if (count > maxCount) {
            maxCount = count;
            tipoPredominante = tipo;
        }
    });

    const total = g.total || 1;
    return {
        rango: g.label, // "rango" es el nombre generico que usa el front (podria ser genero o nacionalidad)
        metadata: g.metadata,
        total_personas: g.total,
        porcentaje_sin_luz: Math.round((g.sin_luz / total) * 100),
        porcentaje_sin_gas: Math.round((g.sin_gas / total) * 100),
        porcentaje_sin_agua: Math.round((g.sin_agua / total) * 100),
        porcentaje_sin_internet: Math.round((g.sin_internet / total) * 100),
        vivienda_predominante: tipoPredominante,
        vivienda_predominante_porcentaje: Math.round((maxCount / total) * 100)
    };
}

// --- REPORTE DERECHOS VULNERADOS ---
const obtenerReporteDerechosVulnerados = async ({ anio, minEdad = 0, maxEdad = 100, generos = [], nacionalidades = [] }) => {
    let anioNum = parseInt(anio, 10);
    if (isNaN(anioNum)) anioNum = new Date().getFullYear();

    let min = parseInt(minEdad, 10);
    let max = parseInt(maxEdad, 10);
    if (isNaN(min)) min = 0;
    if (isNaN(max)) max = 100;

    const start = `${anioNum}-01-01T00:00:00`;
    const end = `${anioNum + 1}-01-01T00:00:00`;

    // 1. Obtener Servicios Locales del año con relaciones
    const { data: servicios, error } = await supabase
        .from('servicio_local')
        .select(`
            id,
            fecha_ingreso,
            persona:dni (
                dni,
                fecha_nacimiento,
                generoObj:genero(nombre),
                nacionalidadObj:nacionalidad(nombre)
            ),
            derecho:derecho_vulnerado (*)
        `)
        .gte('fecha_ingreso', start)
        .lt('fecha_ingreso', end);

    if (error) throw error;

    // 2. Procesamiento en Memoria
    const resultado = {
        ranking_general: [],
        por_edad: [],
        por_genero: [],
        por_nacionalidad: []
    };

    // Estructuras auxiliares
    // Estructuras auxiliares
    const rankingMap = {};
    const subRangos = generarSubRangos(min, max);
    const gruposEdad = subRangos.map(r => initDerechoGroup(r.label, r));
    const gruposGenero = {};
    const gruposNacionalidad = {};

    const fechaReferencia = (anioNum === new Date().getFullYear()) ? new Date() : new Date(anioNum, 11, 31);

    servicios.forEach(s => {
        const p = s.persona;
        const derecho = s.derecho; // Puede ser null si se borró el derecho pero quedó el servicio (data integrity)

        if (!p || !derecho) return;

        // --- Filtro Demográfico: Edad ---
        if (!p.fecha_nacimiento) return;
        const fechaNac = new Date(p.fecha_nacimiento);
        let edad = fechaReferencia.getFullYear() - fechaNac.getFullYear();
        const m = fechaReferencia.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && fechaReferencia.getDate() < fechaNac.getDate())) {
            edad--;
        }

        if (edad < min || edad > max) return;

        // --- Filtro Demográfico: Género y Nacionalidad ---
        const generoNombre = p.generoObj?.nombre;
        const nacionalidadNombre = p.nacionalidadObj?.nombre;

        if (generos && generos.length > 0) {
            if (!generoNombre || !generos.includes(generoNombre)) return;
        }
        if (nacionalidades && nacionalidades.length > 0) {
            if (!nacionalidadNombre || !nacionalidades.includes(nacionalidadNombre)) return;
        }

        // --- Agregar al Ranking General ---
        // Contamos por derecho vulnerado
        const derechoDesc = derecho.descripcion;
        if (!rankingMap[derechoDesc]) {
            rankingMap[derechoDesc] = { derecho: derechoDesc, cantidad: 0, id_derecho: derecho.id };
        }
        rankingMap[derechoDesc].cantidad++;

        // --- Agregar a Grupos por Edad ---
        const grupoEdad = gruposEdad.find(g => edad >= g.metadata.min && edad <= g.metadata.max);
        if (grupoEdad) {
            updateDerechoStats(grupoEdad, derechoDesc);
        }

        // --- Agregar a Grupos por Genero ---
        const generoKey = generoNombre || 'No Especificado';
        if (!gruposGenero[generoKey]) gruposGenero[generoKey] = initDerechoGroup(generoKey);
        updateDerechoStats(gruposGenero[generoKey], derechoDesc);

        // --- Agregar a Grupos por Nacionalidad ---
        const nacKey = nacionalidadNombre || 'No Especificada';
        if (!gruposNacionalidad[nacKey]) gruposNacionalidad[nacKey] = initDerechoGroup(nacKey);
        updateDerechoStats(gruposNacionalidad[nacKey], derechoDesc);
    });

    // Formatear Ranking General (Top 10 por ejemplo, o todos ordenados)
    resultado.ranking_general = Object.values(rankingMap).sort((a, b) => b.cantidad - a.cantidad);

    // Formatear Demográficos
    resultado.por_edad = gruposEdad.map(formatDerechoGroupResult);
    resultado.por_genero = Object.values(gruposGenero).map(formatDerechoGroupResult);
    resultado.por_nacionalidad = Object.values(gruposNacionalidad).map(formatDerechoGroupResult);

    return resultado;
};

// Helper init group reportes derechos
function initDerechoGroup(label, metadata = {}) {
    return {
        label,
        metadata,
        total_casos: 0,
        derechos_map: {} // mapa interno para contar cada derecho en este grupo
    };
}

function updateDerechoStats(group, derechoDesc) {
    group.total_casos++;
    group.derechos_map[derechoDesc] = (group.derechos_map[derechoDesc] || 0) + 1;
}

function formatDerechoGroupResult(g) {
    // Convertir el mapa de derechos a un array ordenado para que el front muestre el "top" de ese grupo o similar
    const ranking = Object.entries(g.derechos_map)
        .map(([der, count]) => ({ derecho: der, cantidad: count }))
        .sort((a, b) => b.cantidad - a.cantidad);

    // Obtenemos el más frecuente para mostrar "Principal: Violencia (5)" por ejemplo
    const principal = ranking.length > 0 ? ranking[0] : null;

    return {
        rango: g.label,
        metadata: g.metadata,
        total_casos: g.total_casos,
        ranking: ranking, // Detalle completo por si se quiere tooltip complejo
        principal_derecho: principal ? principal.derecho : 'N/A',
        principal_cantidad: principal ? principal.cantidad : 0
    };
}


// --- Función para obtener detalle de personas (Drill-down) ---
const obtenerDetallePersonas = async ({ tipo, anio, filtros }) => {
    // --- NUEVO: Lógica para Alertas ---
    if (tipo && tipo.startsWith('ALERTA_')) {
        const resultados = [];

        // Fetch Personas Basic Data needed for all alerts
        const { data: personas, error: errP } = await supabase
            .from('persona')
            .select(`
                dni, fecha_nacimiento, nombre, apellido,
                generoObj:genero(nombre),
                nacionalidadObj:nacionalidad(nombre)
            `);
        if (errP) throw errP;

        if (tipo === 'ALERTA_SIN_FAMILIA') {
            const min = filtros.minEdad ? parseInt(filtros.minEdad) : 0;
            const max = filtros.maxEdad ? parseInt(filtros.maxEdad) : 21;

            const { data: familias } = await supabase.from('familia').select('dni_origen, dni_destino');
            const dnisConFamilia = new Set();
            familias?.forEach(f => {
                dnisConFamilia.add(f.dni_origen);
                dnisConFamilia.add(f.dni_destino);
            });

            personas.forEach(p => {
                if (!p.fecha_nacimiento) return;
                const edad = _calcularEdad(new Date(p.fecha_nacimiento));
                if (edad < min || edad > max) return;

                if (!dnisConFamilia.has(p.dni)) {
                    resultados.push({
                        nombre: p.nombre, apellido: p.apellido, dni: p.dni, edad,
                        genero: p.generoObj?.nombre, nacionalidad: p.nacionalidadObj?.nombre,
                        info_adicional: 'Sin vínculos familiares registrados'
                    });
                }
            });
        }
        else if (tipo === 'ALERTA_SIN_MOVIMIENTOS') {
            const min = filtros.minEdad ? parseInt(filtros.minEdad) : 0;
            const max = filtros.maxEdad ? parseInt(filtros.maxEdad) : 21;

            const hace15dias = new Date();
            hace15dias.setDate(hace15dias.getDate() - 15);

            const { data: servicios } = await supabase
                .from('servicio_local')
                .select('id, dni, fecha_ingreso, hoja_ruta(fecha)');

            const dniStuck = new Set();

            servicios?.forEach(s => {
                let ultimaFecha = s.fecha_ingreso ? new Date(s.fecha_ingreso) : null;
                if (s.hoja_ruta && s.hoja_ruta.length > 0) {
                    const fechas = s.hoja_ruta.map(h => new Date(h.fecha));
                    const maxFecha = new Date(Math.max.apply(null, fechas));
                    if (ultimaFecha === null || maxFecha > ultimaFecha) ultimaFecha = maxFecha;
                }

                if (!ultimaFecha || ultimaFecha < hace15dias) {
                    dniStuck.add(s.dni);
                }
            });

            personas.forEach(p => {
                if (!dniStuck.has(p.dni)) return;

                if (!p.fecha_nacimiento) return;
                const edad = _calcularEdad(new Date(p.fecha_nacimiento));
                if (edad < min || edad > max) return;

                resultados.push({
                    nombre: p.nombre, apellido: p.apellido, dni: p.dni,
                    edad,
                    genero: p.generoObj?.nombre, nacionalidad: p.nacionalidadObj?.nombre,
                    info_adicional: 'Sin movimientos en Servicio Local > 15 días'
                });
            });
        }
        else if (tipo === 'ALERTA_DESACTUALIZADOS') {
            const min = filtros.minEdad ? parseInt(filtros.minEdad) : 0;
            const max = filtros.maxEdad ? parseInt(filtros.maxEdad) : 21;

            const hace15dias = new Date(); // Unused here but kept for variable consistency if needed
            const hace1anio = new Date();
            hace1anio.setFullYear(hace1anio.getFullYear() - 1);

            const { data: controles } = await supabase.from('control_medico').select('dni, fecha_real');
            const { data: escolaridad } = await supabase.from('escolaridad').select('dni, fecha_real, fecha_carga');

            const mapSalud = new Map();
            controles?.forEach(c => {
                const f = new Date(c.fecha_real);
                if (!mapSalud.has(c.dni) || f > mapSalud.get(c.dni)) mapSalud.set(c.dni, f);
            });

            const mapEducacion = new Map();
            escolaridad?.forEach(e => {
                const f = e.fecha_real ? new Date(e.fecha_real) : new Date(e.fecha_carga);
                if (!mapEducacion.has(e.dni) || f > mapEducacion.get(e.dni)) mapEducacion.set(e.dni, f);
            });

            personas.forEach(p => {
                if (!p.fecha_nacimiento) return;
                const edad = _calcularEdad(new Date(p.fecha_nacimiento));
                if (edad < min || edad > max) return;

                let fechaSalud = mapSalud.get(p.dni);
                let fechaEduc = mapEducacion.get(p.dni);

                const saludOk = fechaSalud && fechaSalud >= hace1anio;
                const educOk = fechaEduc && fechaEduc >= hace1anio;

                if (!saludOk || !educOk) {
                    let motivos = [];
                    if (!saludOk) motivos.push('Salud');
                    if (!educOk) motivos.push('Educación');

                    resultados.push({
                        nombre: p.nombre, apellido: p.apellido, dni: p.dni,
                        edad,
                        genero: p.generoObj?.nombre, nacionalidad: p.nacionalidadObj?.nombre,
                        info_adicional: `Datos desactualizados: ${motivos.join(', ')}`
                    });
                }
            });
        }

        return resultados.sort((a, b) => a.apellido.localeCompare(b.apellido));
    }

    // --- ESTANDAR ---
    if (tipo === 'DERECHOS_VULNERADOS') {
        const anioNum = parseInt(anio, 10);
        const start = `${anioNum}-01-01T00:00:00`;
        const end = `${anioNum + 1}-01-01T00:00:00`;

        const query = supabase
            .from('servicio_local')
            .select(`
                 fecha_ingreso,
                 persona:dni (
                     nombre,
                     apellido,
                     dni,
                     fecha_nacimiento,
                     generoObj:genero(nombre),
                     nacionalidadObj:nacionalidad(nombre)
                 ),
                 derecho:derecho_vulnerado (*)
             `)
            .gte('fecha_ingreso', start)
            .lt('fecha_ingreso', end);

        const { data: servicios, error } = await query;
        if (error) throw error;

        const resultados = [];
        const fechaReferencia = (anioNum === new Date().getFullYear()) ? new Date() : new Date(anioNum, 11, 31);

        servicios.forEach(s => {
            const p = s.persona;
            const d = s.derecho;
            if (!p || !d) return; // Skip si falta data

            // Calcular edad
            if (!p.fecha_nacimiento) return;
            const fechaNac = new Date(p.fecha_nacimiento);
            let edad = fechaReferencia.getFullYear() - fechaNac.getFullYear();
            const m = fechaReferencia.getMonth() - fechaNac.getMonth();
            if (m < 0 || (m === 0 && fechaReferencia.getDate() < fechaNac.getDate())) {
                edad--;
            }

            const genero = p.generoObj?.nombre;
            const nacionalidad = p.nacionalidadObj?.nombre;
            const derechoDesc = d.descripcion;

            // --- APLICAR FILTROS DRILL-DOWN ---

            // 1. Rango Etario
            if (filtros.minEdad !== undefined && filtros.maxEdad !== undefined) {
                if (edad < parseInt(filtros.minEdad) || edad > parseInt(filtros.maxEdad)) return;
            }

            // 2. Género
            if (filtros.genero && filtros.genero !== 'Todos' && !Array.isArray(filtros.genero)) {
                if (genero !== filtros.genero) return;
            }
            if (filtros.generos && Array.isArray(filtros.generos) && filtros.generos.length > 0) {
                if (!filtros.generos.includes(genero)) return;
            }
            if (Array.isArray(filtros.genero) && filtros.genero.length > 0) {
                if (!filtros.genero.includes(genero)) return;
            }

            // 3. Nacionalidad
            if (filtros.nacionalidad && filtros.nacionalidad !== 'Todas' && !Array.isArray(filtros.nacionalidad)) {
                if (nacionalidad !== filtros.nacionalidad) return;
            }
            if (filtros.nacionalidades && Array.isArray(filtros.nacionalidades) && filtros.nacionalidades.length > 0) {
                if (!filtros.nacionalidades.includes(nacionalidad)) return;
            }
            if (Array.isArray(filtros.nacionalidad) && filtros.nacionalidad.length > 0) {
                if (!filtros.nacionalidad.includes(nacionalidad)) return;
            }

            // 4. Derecho Específico (para drill down desde el ranking general)
            // El front mandará 'derecho' como filtro si clickea en el grafico general
            if (filtros.derecho) {
                if (derechoDesc !== filtros.derecho) return;
            }

            resultados.push({
                nombre: p.nombre,
                apellido: p.apellido,
                dni: p.dni,
                edad: edad,
                genero: genero,
                nacionalidad: nacionalidad,
                info_adicional: `Derecho: ${derechoDesc} (Ingreso: ${new Date(s.fecha_ingreso).toLocaleDateString()})`
            });
        });

        return resultados;
    }

    // 1. Obtener base de personas con datos básicos
    const { data: personas, error } = await supabase
        .from('persona')
        .select(`
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            generoObj:genero(nombre),
            nacionalidadObj:nacionalidad(nombre),
            condiciones:condiciones_vida(*),
            escolaridad(*)
        `);

    if (error) throw error;

    const resultados = [];
    const fechaReferencia = tipo === 'ESCOLARIDAD'
        ? (parseInt(anio) === new Date().getFullYear() ? new Date() : new Date(parseInt(anio), 11, 31))
        : new Date();

    // Preparar mapa de escolaridad si es necesario (Optimización)
    let escolaridadMap = new Map();
    if (tipo === 'ESCOLARIDAD') {
        // Filtrar registros de escolaridad para el año específico
        // Replicamos la lógica de obtenerReporteEscolaridad
        // Buscar escolaridad que coincida con fecha_real o fecha_carga en ese año
        // Esto es costoso hacerlo en memoria si son muchos, idealmente filtrar query
        // Para consistencia exacta, iteramos lo que trajimos o hacemos fetch especifico
        // Haremos fetch especifico de escolaridad para asegurarnos
        const anioNum = parseInt(anio, 10);
        const start = `${anioNum}-01-01T00:00:00`;
        const end = `${anioNum + 1}-01-01T00:00:00`;

        const { data: rawEsc } = await supabase
            .from('escolaridad')
            .select('dni, fecha_real, fecha_carga')
            .or(`and(fecha_real.gte.${start},fecha_real.lt.${end}),and(fecha_carga.gte.${start},fecha_carga.lt.${end})`);

        if (rawEsc) {
            rawEsc.forEach(reg => {
                const fechaEfectiva = reg.fecha_real ? new Date(reg.fecha_real) : new Date(reg.fecha_carga);
                if (fechaEfectiva.getFullYear() === anioNum) {
                    escolaridadMap.set(reg.dni, true);
                }
            });
        }
    }

    personas.forEach(p => {
        if (!p.fecha_nacimiento) return;

        // Calcular edad
        const fechaNac = new Date(p.fecha_nacimiento);
        let edad = fechaReferencia.getFullYear() - fechaNac.getFullYear();
        const m = fechaReferencia.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && fechaReferencia.getDate() < fechaNac.getDate())) {
            edad--;
        }

        const genero = p.generoObj?.nombre;
        const nacionalidad = p.nacionalidadObj?.nombre;

        // --- Aplicar Filtros ---

        // 1. Edad
        if (filtros.edadExacta !== undefined) {
            if (edad !== parseInt(filtros.edadExacta)) return;
        } else if (filtros.minEdad !== undefined && filtros.maxEdad !== undefined) {
            if (edad < parseInt(filtros.minEdad) || edad > parseInt(filtros.maxEdad)) return;
        }

        // 2. Género
        if (filtros.genero && filtros.genero !== 'Todos' && !Array.isArray(filtros.genero)) {
            if (genero !== filtros.genero) return;
        }
        if (filtros.generos && Array.isArray(filtros.generos) && filtros.generos.length > 0) {
            if (!filtros.generos.includes(genero)) return;
        }
        // Soporte para cuando se envía array en campo singular (legacy frontend compatibility)
        if (Array.isArray(filtros.genero) && filtros.genero.length > 0) {
            if (!filtros.genero.includes(genero)) return;
        }


        // 3. Nacionalidad
        if (filtros.nacionalidad && filtros.nacionalidad !== 'Todas' && !Array.isArray(filtros.nacionalidad)) {
            if (nacionalidad !== filtros.nacionalidad) return;
        }
        if (filtros.nacionalidades && Array.isArray(filtros.nacionalidades) && filtros.nacionalidades.length > 0) {
            if (!filtros.nacionalidades.includes(nacionalidad)) return;
        }
        // Soporte para array en campo singular
        if (Array.isArray(filtros.nacionalidad) && filtros.nacionalidad.length > 0) {
            if (!filtros.nacionalidad.includes(nacionalidad)) return;
        }

        // --- Lógica Específica por Tipo ---

        if (tipo === 'ESCOLARIDAD') {
            const esEscolarizado = escolaridadMap.has(p.dni);
            const buscaEscolarizado = filtros.escolarizado === true || filtros.escolarizado === 'true';

            if (buscaEscolarizado !== esEscolarizado) return;
        }
        else if (tipo === 'CONDICIONES_VIDA') {
            const cond = p.condiciones && p.condiciones.length > 0 ? p.condiciones[0] : null;

            if (filtros.carencia) {
                if (filtros.carencia === 'SIN_LUZ' && (cond?.acceso_luz !== false)) return;
                if (filtros.carencia === 'SIN_GAS' && (cond?.acceso_gas !== false)) return;
                if (filtros.carencia === 'SIN_AGUA' && (cond?.acceso_agua !== false)) return;
                if (filtros.carencia === 'SIN_INTERNET' && (cond?.acceso_internet !== false)) return;
            }
        }

        // Si pasó todos los filtros, agregamos
        resultados.push({
            nombre: p.nombre,
            apellido: p.apellido,
            dni: p.dni,
            edad: edad, // util para debug
            genero: genero,
            nacionalidad: nacionalidad
        });
    });

    // Ordenar alfabeticamente
    return resultados.sort((a, b) => a.apellido.localeCompare(b.apellido));
};

const obtenerAniosDerechosVulnerados = async () => {
    // Obtenemos todas las fechas de ingreso de servicios locales
    const { data, error } = await supabase
        .from('servicio_local')
        .select('fecha_ingreso');

    if (error) throw error;

    const aniosSet = new Set();
    data.forEach(registro => {
        if (registro.fecha_ingreso) {
            const anio = new Date(registro.fecha_ingreso).getFullYear();
            aniosSet.add(anio);
        }
    });

    // Convertir a array y ordenar descendente
    return Array.from(aniosSet).sort((a, b) => b - a);
};

const obtenerAlertas = async ({ minEdad = 0, maxEdad = 21 }) => {
    const min = parseInt(minEdad, 10);
    const max = parseInt(maxEdad, 10);
    const fechaActual = new Date();
    const hace15dias = new Date();
    hace15dias.setDate(hace15dias.getDate() - 15);
    const hace1anio = new Date();
    hace1anio.setFullYear(hace1anio.getFullYear() - 1);

    // --- ALERTA 1: Personas sin Familia ---
    const { data: personas, error: errP } = await supabase
        .from('persona')
        .select('dni, fecha_nacimiento, nombre, apellido');

    if (errP) throw errP;

    const { data: familias, error: errF } = await supabase
        .from('familia')
        .select('dni_origen, dni_destino');

    if (errF) throw errF;

    const dnisConFamilia = new Set();
    familias.forEach(f => {
        dnisConFamilia.add(f.dni_origen);
        dnisConFamilia.add(f.dni_destino);
    });

    let countSinFamilia = 0;
    personas.forEach(p => {
        if (!p.fecha_nacimiento) return;
        const edad = _calcularEdad(new Date(p.fecha_nacimiento));
        if (edad < min || edad > max) return;

        if (!dnisConFamilia.has(p.dni)) {
            countSinFamilia++;
        }
    });

    // --- ALERTA 2: Sin Movimientos en 15 dias ---
    const { data: servicios, error: errS } = await supabase
        .from('servicio_local')
        .select(`
            id, 
            dni, 
            fecha_ingreso, 
            hoja_ruta(fecha),
            persona:dni(fecha_nacimiento)
        `);

    if (errS) throw errS;

    let countSinMovimientos = 0;
    servicios.forEach(s => {
        // Filtro de edad
        if (!s.persona || !s.persona.fecha_nacimiento) return;
        const edad = _calcularEdad(new Date(s.persona.fecha_nacimiento));
        if (edad < min || edad > max) return;

        let ultimaFecha = s.fecha_ingreso ? new Date(s.fecha_ingreso) : null;

        if (s.hoja_ruta && s.hoja_ruta.length > 0) {
            const fechas = s.hoja_ruta.map(h => new Date(h.fecha));
            const maxFecha = new Date(Math.max.apply(null, fechas));
            if (ultimaFecha === null || maxFecha > ultimaFecha) {
                ultimaFecha = maxFecha;
            }
        }

        // Si no tiene fechas (ultimaFecha es null) O la última fecha es vieja
        if (!ultimaFecha || ultimaFecha < hace15dias) {
            countSinMovimientos++;
        }
    });

    // --- ALERTA 3: Desactualizados ---
    const { data: controles } = await supabase.from('control_medico').select('dni, fecha_real');
    const { data: escolaridad } = await supabase.from('escolaridad').select('dni, fecha_real, fecha_carga');

    const mapSalud = new Map();
    controles?.forEach(c => {
        const f = new Date(c.fecha_real);
        if (!mapSalud.has(c.dni) || f > mapSalud.get(c.dni)) mapSalud.set(c.dni, f);
    });

    const mapEducacion = new Map();
    escolaridad?.forEach(e => {
        const f = e.fecha_real ? new Date(e.fecha_real) : new Date(e.fecha_carga);
        if (!mapEducacion.has(e.dni) || f > mapEducacion.get(e.dni)) mapEducacion.set(e.dni, f);
    });

    let countDesactualizados = 0;
    personas.forEach(p => {
        if (!p.fecha_nacimiento) return;
        const edad = _calcularEdad(new Date(p.fecha_nacimiento));
        if (edad < min || edad > max) return;

        let fechaSalud = mapSalud.get(p.dni);
        let fechaEduc = mapEducacion.get(p.dni);

        const saludOk = fechaSalud && fechaSalud >= hace1anio;
        const educOk = fechaEduc && fechaEduc >= hace1anio;

        if (!saludOk || !educOk) {
            countDesactualizados++;
        }
    });

    return {
        sin_familia: countSinFamilia,
        sin_movimientos: countSinMovimientos,
        desactualizados: countDesactualizados
    };
};

function _calcularEdad(fechaNac) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad;
}

module.exports = {
    obtenerReporteEscolaridad,
    obtenerAniosDisponibles,
    obtenerReporteCondicionesVida,
    obtenerReporteDerechosVulnerados,
    obtenerDetallePersonas,
    obtenerAniosDerechosVulnerados,
    obtenerAlertas
};
