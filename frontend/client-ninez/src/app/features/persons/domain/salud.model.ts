export interface Salud {
    id?: number;
    persona_dni: number;
    nombre?: string; // Obra Social / Cobertura
    enfermedad_cronica?: string;
    tratamiento_prolongado?: string;
    discapacidad?: string;
    adicciones?: string;
    fecha_carga?: Date;
}
