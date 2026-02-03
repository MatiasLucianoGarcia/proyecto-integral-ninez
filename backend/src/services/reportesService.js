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

module.exports = {
    obtenerReporteEscolaridad,
    obtenerAniosDisponibles
};
