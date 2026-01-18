import { Component, inject } from '@angular/core';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { Persona } from '../../domain';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PersonService } from '../../services/person.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y';
import { PersonCardComponent } from '../person-card';
import { Router } from '@angular/router';

@Component({
	selector: 'app-search-person',
	imports: [
		MatFormField,
		MatLabel,
		ReactiveFormsModule,
		MatListModule,
		CommonModule,
		MatCardModule,
		MatInputModule,
		MatButtonModule,
		MatIcon,
		A11yModule,
		PersonCardComponent,
	],
	templateUrl: './search-person.component.html',
	styleUrl: './search-person.component.scss',
})
export class SearchPersonComponent {
	persons$: Observable<Persona[]> = new Observable();

	private fb = inject(NonNullableFormBuilder);
	private personService = inject(PersonService);
	private router = inject(Router);

	searchForm = this.fb.group({
		dni: [''],
		nombre: [''],
	});

	personForm = this.fb.group({
		dni: [''],
		nombre: [''],
		apellido: [''],
		fecha_nacimiento: [''],
	});

	isEditing = false;

	constructor() {
		// Configurar búsqueda en tiempo real
		this.persons$ = this.searchForm.valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged((prev, curr) => prev.dni === curr.dni && prev.nombre === curr.nombre),
			switchMap(({ dni, nombre }) => this.personService.searchPersons(dni, nombre)),
		);
	}

	onSearch() {
		// Método opcional para búsquedas manuales
		const { dni, nombre } = this.searchForm.value;
		this.persons$ = this.personService.searchPersons(dni, nombre);
	}

	onAddPerson(): void {
		this.router.navigate(['/person-form'], {
			queryParams: {
				mode: 'create',
			},
		});
	}

	onSelectPerson(person: Persona) {
		this.isEditing = true;
		this.personForm.patchValue({
			...person,
			dni: person.dni.toString(), // Convertir DNI a string
			fecha_nacimiento: person.fecha_nacimiento
				? new Date(person.fecha_nacimiento).toISOString().split('T')[0] // Convertir fecha a string (YYYY-MM-DD)
				: '',
		});
	}

	onDniChange() {
		const dni = this.personForm.get('dni')?.value;
		if (dni) {
			this.personService.getPersonByDNI(dni).subscribe({
				next: (person) => {
					this.isEditing = true;
					this.personForm.patchValue({
						...person,
						dni: person.dni.toString(), // Convertir DNI a string
						fecha_nacimiento: person.fecha_nacimiento
							? new Date(person.fecha_nacimiento).toISOString().split('T')[0] // Convertir fecha a string (YYYY-MM-DD)
							: '',
					});
				},
				error: () => {
					this.isEditing = false;
					this.personForm.reset({ dni });
				},
			});
		}
	}

	onSave() {
		if (this.isEditing) {
			// Lógica para actualizar persona
			console.log('Actualizar persona:', this.personForm.value);
		} else {
			// Lógica para crear nueva persona
			console.log('Crear nueva persona:', this.personForm.value);
		}
	}

	trackByDni(index: number, person: Persona): string {
		return person.dni.toString(); // Convertir DNI a string
	}

	onNavigate(person: Persona): void {
		console.log('Navegando a detalle de persona:', person);
		// Aquí se puede implementar la lógica de navegación
	}
}
