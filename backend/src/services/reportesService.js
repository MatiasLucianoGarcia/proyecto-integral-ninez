const supabase = require('../config/db');

const obtenerReporteEscolaridad = async (anio, minEdad = 5, maxEdad = 21) => {
    // Convertir anio a entero por seguridad
    const anioNum = parseInt(anio, 10);
    const minEdadNum = parseInt(minEdad, 10);
    const maxEdadNum = parseInt(maxEdad, 10);

    if (isNaN(anioNum)) {
        throw new Error('El año debe ser un número válido');
    }

    // 1. Obtener escolaridad para el año como antes
    const { data: datosEscolaridad, error: errorEsc } = await supabase
        .from('escolaridad')
        .select(`
            dni,
            nivel,
            fecha_carga
        `)
        .gte('fecha_carga', `${anioNum}-01-01T00:00:00`)
        .lt('fecha_carga', `${anioNum + 1}-01-01T00:00:00`);

    if (errorEsc) throw errorEsc;

    // 2. Obtener TODAS las personas para base poblacional
    //    (Podríamos filtrar por rango de edad aquí para optimizar, 
    //     pero calculamos edad en JS por precisión)
    const { data: personas, error: errorPer } = await supabase
        .from('persona')
        .select('dni, fecha_nacimiento');

    if (errorPer) throw errorPer;

    // 3. Procesar: Crear mapa de escolaridad por DNI para acceso rápido
    const escolaridadMap = new Map();
    datosEscolaridad.forEach(reg => {
        // Guardamos todo el registro
        escolaridadMap.set(reg.dni, reg);
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
        .select('fecha_carga');

    if (error) throw error;

    const aniosSet = new Set();
    data.forEach(registro => {
        if (registro.fecha_carga) {
            const anio = new Date(registro.fecha_carga).getFullYear();
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
