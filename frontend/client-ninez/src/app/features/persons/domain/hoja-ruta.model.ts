import { ServicioLocal } from './servicio-local.model';

export interface HojaRuta {
    id: number;
    id_servicio_local: number;
    servicio_local?: ServicioLocal;
    fecha: string; // YYYY-MM-DD
    actividad: string;
    resultado: string;
    fecha_carga: string;
}

export interface CreateHojaRuta {
    id_servicio_local: number;
    fecha: string;
    actividad: string;
    resultado: string;
}
