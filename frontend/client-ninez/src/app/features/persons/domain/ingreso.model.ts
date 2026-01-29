import { Efector } from './efector.model';
import { Programa } from './programa.model';

export interface Ingreso {
    id?: number;
    id_persona?: number;
    id_efector?: number;
    id_programa?: number;
    fecha_ingreso?: string | Date; // Assuming standard fields, but will adjust if backend differs
    // Based on requirements, we need at least these relationships populated or IDs
    efector?: Efector;
    programa?: Programa;
    familiar?: { dni: number; nombre: string; apellido: string };
    observaciones?: string;
}

export interface CreateIngreso {
    dni: number;
    id_efector?: number;
    id_programa: number;
    dni_familiar?: number;
    fecha_ingreso: string | Date;
    observaciones?: string;
}
