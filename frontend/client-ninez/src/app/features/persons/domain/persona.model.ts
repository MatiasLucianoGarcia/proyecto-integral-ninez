import { Genero } from './genero.model';
import { Nacionalidad } from './nacionalidad.model';

export interface Persona {
	id?: number;
	dni: number;
	nombre: string;
	apellido: string;
	fecha_nacimiento: Date;
	genero: Genero;
	nacionalidad: Nacionalidad;
	id_genero?: number;
	id_nacionalidad?: number;
}
