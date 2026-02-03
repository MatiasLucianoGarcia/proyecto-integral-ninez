export interface Actividad {
    id?: number;
    dni: number;
    actividad: string;
    horario: string;
    observaciones?: string;
    fecha_carga?: Date;
    fecha_real?: Date | string;
}
