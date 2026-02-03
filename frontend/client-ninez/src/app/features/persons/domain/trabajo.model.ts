export interface Trabajo {
    id?: number;
    dni: number;
    descripcion: string;
    horario: string;
    fecha_carga?: Date;
    fecha_real?: Date | string;
}
