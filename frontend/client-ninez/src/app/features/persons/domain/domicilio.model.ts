export interface Domicilio {
    id: number;
    dni: number;
    nombre: string;
    numero: string;
}

export interface CreateDomicilio {
    dni: number;
    nombre: string;
    numero: string;
}
