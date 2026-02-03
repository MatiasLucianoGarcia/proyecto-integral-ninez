export interface Perdida {
    id?: number;
    dni: number;
    descripcion: string;
    fecha_carga?: Date;
    fecha_real?: Date | string;
}
