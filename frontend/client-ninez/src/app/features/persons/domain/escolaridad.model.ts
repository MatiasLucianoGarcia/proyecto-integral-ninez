export interface Escolaridad {
    id?: number;
    dni: number;
    escuela: string;
    nivel: string;
    anio: string;
    fecha_carga?: string;
    fecha_real?: Date | string;
}
