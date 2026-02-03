export interface TipoVivienda {
    id: number;
    tipo: string;
}

export interface Vivienda {
    id?: number;
    observaciones?: string;
    tipo_vivienda: TipoVivienda;
    fecha_carga?: string | Date;
    fecha_real?: Date | string;
}

export interface CreateVivienda {
    dni: number;
    tipo_vivienda: number; // ID del tipo
    observaciones?: string;
    fecha_real?: Date | string;
}
