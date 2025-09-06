import { Genero } from './genero.model';
import { Nacionalidad } from './nacionalidad.model';

export interface Persona {
	dni: number;
	nombre: string;
	apellido: string;
	fecha_nacimiento: Date;
	genero: Genero;
	nacionalidad: Nacionalidad;
}
