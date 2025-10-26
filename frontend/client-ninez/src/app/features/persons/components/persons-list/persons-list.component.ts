import { Component, inject } from '@angular/core';
import { PersonService } from '../../services';
import { Persona } from '../../domain';
import { PersonCardComponent } from '../person-card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PersonFormComponent } from '../person-form';

@Component({
	selector: 'app-persons-list',
	imports: [PersonCardComponent, MatButtonModule, MatIconModule, g],
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

	test() {
		this.personService.getPersonByDNI('12345678').subscribe({
			next: (person) => {
				console.log('Person fetched by DNI:', person);
			},
			error: (error) => {
				console.error('Error fetching person by DNI:', error);
			},
		});
	}
}
