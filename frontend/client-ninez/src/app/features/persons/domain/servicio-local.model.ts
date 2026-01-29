export interface ServicioLocal {
    id: number;
    dni: number;
    id_equipo: number;
    equipo?: EquipoLocal; // For joined data
    fecha_ingreso: string;
    motivo_ingreso: string;
    id_efector: number;
    efector?: any; // We might define Efector interface properly if not exists, likely loaded via EfectorService
    id_derecho: number;
    derecho?: DerechoVulnerado; // For joined data
    fecha_carga: string;
}

export interface EquipoLocal {
    id: number;
    nombre: string;
}

export interface DerechoVulnerado {
    id: number;
    descripcion: string;
}

export interface CreateServicioLocal {
    dni: number;
    id_equipo: number;
    fecha_ingreso: string; // YYYY-MM-DD
    motivo_ingreso: string;
    id_efector: number;
    id_derecho: number;
}
