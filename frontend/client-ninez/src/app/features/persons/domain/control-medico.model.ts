export interface ControlMedico {
    id?: number;
    dni: number;
    unidad_sanitaria: string;
    observaciones?: string;
    fecha_carga?: Date;
}
