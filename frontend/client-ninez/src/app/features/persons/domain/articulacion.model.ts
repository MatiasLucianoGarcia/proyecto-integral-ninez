import { Efector } from './efector.model';
import { Ingreso } from './ingreso.model';

export interface Articulacion {
    id?: number;
    id_ingreso: number;
    id_efector?: number;
    observacion?: string;
    fecha_articulacion: string | Date;

    // Relationships for display
    efector?: Efector;
    ingreso_programa?: {
        dni: number;
        programa?: { nombre: string }
    };
}

export interface CreateArticulacion {
    id_ingreso: number;
    id_efector: number;
    observacion?: string;
    fecha_articulacion: string | Date;
}
