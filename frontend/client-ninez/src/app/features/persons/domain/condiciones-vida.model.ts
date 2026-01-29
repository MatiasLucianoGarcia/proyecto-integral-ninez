export interface CondicionesVida {
    id?: number;
    dni: number;
    acceso_luz: boolean;
    acceso_gas: boolean;
    acceso_agua: boolean;
    acceso_internet: boolean;
    alimentos_propios: boolean;
    fecha_carga?: string | Date;
}
