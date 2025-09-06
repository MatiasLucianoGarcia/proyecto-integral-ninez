import { Component, inject } from '@angular/core';
import { PersonService } from '../../services';
import { Persona } from '../../domain';
import { PersonCardComponent } from '../person-card';

@Component({
	selector: 'app-persons-list',
	imports: [PersonCardComponent],
	templateUrl: './persons-list.component.html',
	styleUrl: './persons-list.component.scss',
})
export class PersonsListComponent {
	private personService = inject(PersonService);
	persons: Persona[] = [];

	constructor() {
		this.personService.getPersons().subscribe({
			next: (persons) => {
				this.persons = persons;
				console.log(this.persons);
			},
			error: (error) => {
				console.error('Error fetching persons:', error);
			},
		});
	}
}
