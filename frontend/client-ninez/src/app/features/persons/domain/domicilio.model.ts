export interface Domicilio {
    id: number;
    dni: number;
    nombre: string;
    numero: string;
    fecha_real?: Date | string;
}

export interface CreateDomicilio {
    dni: number;
    nombre: string;
    numero: string;
    fecha_real?: Date | string;
}
