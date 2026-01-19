import { Persona } from './persona.model';

export interface Parentezco {
	id: number;
	descripcion: string;
}

export interface FamilyMember {
	id: number;
	persona: Persona;
	parentezco: Parentezco;
	observaciones?: string;
}

export interface CreateFamilyMember {
	dni_p1: number;
	dni_p2: number;
	id_parentezco1: number;
	id_parentezco2: number;
	observaciones?: string;
}
