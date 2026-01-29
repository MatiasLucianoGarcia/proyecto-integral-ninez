export interface TipoVivienda {
    id: number;
    tipo: string;
}

export interface Vivienda {
    id?: number;
    observaciones?: string;
    tipo_vivienda: TipoVivienda;
    fecha_carga?: string | Date;
}

export interface CreateVivienda {
    dni: number;
    tipo_vivienda: number; // ID del tipo
    observaciones?: string;
}
