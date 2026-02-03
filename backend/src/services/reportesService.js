const supabase = require('../config/db');

const obtenerReporteEscolaridad = async (anio, minEdad = 5, maxEdad = 21) => {
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
        .select('dni, fecha_nacimiento');

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

    personas.forEach((persona) => {
        if (!persona.fecha_nacimiento) return;

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

        // Inicializar estructura para esta edad
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
    });

    // Convertir objeto a array ordenado por edad
    const resultado = Object.values(reporte).sort((a, b) => a.edad - b.edad);

    return resultado;
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
    const total = max - min;
    const subRangos = [];

    let pasos;
    if (total <= 10) pasos = 2; // e.g. 5-15 -> split 2
    else if (total <= 20) pasos = 3; // e.g 0-20 -> split 3
    else pasos = 4; // > 20 -> split 4

    const tamaño = Math.ceil(total / pasos);

    let actual = min;
    while (actual < max) {
        let fin = actual + tamaño;
        if (fin > max) fin = max;

        // Ajuste para el último rango si queda muy chico o para cerrar justo
        if (subRangos.length === pasos - 1) fin = max;

        subRangos.push({ min: actual, max: fin, label: `${actual} - ${fin} años` });
        actual = fin + 1;
    }
    return subRangos;
};

const obtenerReporteCondicionesVida = async ({ minEdad = 0, maxEdad = 100 }) => {
    // 1. Obtener Base de Personas con relaciones
    // Traemos campos necesarios para filtros y datos
    let query = supabase
        .from('persona')
        .select(`
            dni,
            fecha_nacimiento,
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
        por_edad: []
    };

    // Generar rangos etarios dinámicos
    const subRangos = generarSubRangos(parseInt(minEdad), parseInt(maxEdad));

    // Inicializar grupos por edad
    const gruposEdad = subRangos.map(r => ({
        rango: r,
        total: 0,
        sin_agua: 0,
        sin_luz: 0,
        sin_gas: 0,
        sin_internet: 0,
        tipos_vivienda: {}
    }));

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

        // --- Procesar Datos ---

        // Condiciones de Vida (Usamos el único registro si existe)
        const cond = p.condiciones && p.condiciones.length > 0 ? p.condiciones[0] : null;

        // Vivienda (Usamos la última, query ya trae array, tomamos la ultima si ordenamos o asumimos lógica de negocio.
        // Supabase devuelve orden inserción default, ideal ordenar en query o aquí. 
        // Como 'viviendas' es array, y queremos la mas reciente, asumimos que no hay fecha en vivienda en este scope simple,
        // pero idealmente deberíamos ordenar por fecha_carga o fecha_real. 
        // SIMPLIFICACION: Tomamos la última del array (asumiendo orden cronológico de carga).
        const vivienda = p.viviendas && p.viviendas.length > 0 ? p.viviendas[p.viviendas.length - 1] : null;

        // Flags de carencia (true si le FALTAN cosas)
        // La DB tiene 'acceso_luz': true/false. Si es false o null -> cuenta como carencia?
        // Asumiremos: false = no tiene, null = no relevado (no cuenta o cuenta como no? user prompt dice "sin acceso")
        // Interpretación: Si acceso_luz === false -> sumar 1.

        const sinLuz = cond?.acceso_luz === false;
        const sinGas = cond?.acceso_gas === false;
        const sinAgua = cond?.acceso_agua === false;
        const sinInternet = cond?.acceso_internet === false;

        // Agregado Global
        resultado.global.total_personas++;
        if (sinLuz) resultado.global.sin_luz++;
        if (sinGas) resultado.global.sin_gas++;
        if (sinAgua) resultado.global.sin_agua++;
        if (sinInternet) resultado.global.sin_internet++;

        if (vivienda && vivienda.tipo_vivienda) {
            const tipo = vivienda.tipo_vivienda.tipo;
            resultado.global.tipos_vivienda[tipo] = (resultado.global.tipos_vivienda[tipo] || 0) + 1;
        }

        // Agregado por Edad
        // Buscar en qué subrango cae
        const grupo = gruposEdad.find(g => edad >= g.rango.min && edad <= g.rango.max);
        if (grupo) {
            grupo.total++;
            if (sinLuz) grupo.sin_luz++;
            if (sinGas) grupo.sin_gas++;
            if (sinAgua) grupo.sin_agua++;
            if (sinInternet) grupo.sin_internet++;
            if (vivienda && vivienda.tipo_vivienda) {
                const tipo = vivienda.tipo_vivienda.tipo;
                grupo.tipos_vivienda[tipo] = (grupo.tipos_vivienda[tipo] || 0) + 1;
            }
        }
    });

    // Formatear resultados por edad
    resultado.por_edad = gruposEdad.map(g => {
        // Calcular predominante vivienda
        let tipoPredominante = 'N/A';
        let maxCount = 0;
        Object.entries(g.tipos_vivienda).forEach(([tipo, count]) => {
            if (count > maxCount) {
                maxCount = count;
                tipoPredominante = tipo;
            }
        });

        // Calcular porcentajes
        const total = g.total || 1; // evitar div 0
        return {
            rango: g.rango.label,
            total_personas: g.total,
            porcentaje_sin_luz: Math.round((g.sin_luz / total) * 100),
            porcentaje_sin_gas: Math.round((g.sin_gas / total) * 100),
            porcentaje_sin_agua: Math.round((g.sin_agua / total) * 100),
            porcentaje_sin_internet: Math.round((g.sin_internet / total) * 100),
            vivienda_predominante: tipoPredominante,
            vivienda_predominante_porcentaje: Math.round((maxCount / total) * 100)
        };
    });

    // Formatear Globales a porcentajes
    const totalG = resultado.global.total_personas || 1;
    resultado.global.porcentaje_sin_luz = Math.round((resultado.global.sin_luz / totalG) * 100);
    resultado.global.porcentaje_sin_gas = Math.round((resultado.global.sin_gas / totalG) * 100);
    resultado.global.porcentaje_sin_agua = Math.round((resultado.global.sin_agua / totalG) * 100);
    resultado.global.porcentaje_sin_internet = Math.round((resultado.global.sin_internet / totalG) * 100);

    return resultado;
};

module.exports = {
    obtenerReporteEscolaridad,
    obtenerAniosDisponibles,
    obtenerReporteCondicionesVida
};
