import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { PersonService } from '../../services/person.service';
import { Persona } from '../../domain/persona.model';

type FormMode = 'create' | 'edit' | 'view';

@Component({
	selector: 'app-person-form',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatCardModule,
		MatProgressSpinnerModule,
		MatChipsModule,
		MatDividerModule,
	],
	templateUrl: './person-form.component.html',
	styleUrl: './person-form.component.scss',
})
export class PersonFormComponent implements OnInit {
	private fb = inject(FormBuilder);
	private personService = inject(PersonService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);

	personForm!: FormGroup;
	mode = signal<FormMode>('create');
	loading = signal(false);
	personDni = signal<string | null>(null);

	// Opciones para los selects (en producción vendrían del backend)
	generos = [{ nombre: 'Masculino' }, { nombre: 'Femenino' }, { nombre: 'Otro' }];

	nacionalidades = [
		{ nombre: 'Argentina' },
		{ nombre: 'Boliviana' },
		{ nombre: 'Brasileña' },
		{ nombre: 'Chilena' },
		{ nombre: 'Paraguaya' },
		{ nombre: 'Uruguaya' },
		{ nombre: 'Venezolana' },
		{ nombre: 'Otra' },
	];

	ngOnInit(): void {
		this.initForm();
		this.loadRouteData();
	}

	private initForm(): void {
		this.personForm = this.fb.group({
			dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
			nombre: ['', [Validators.required, Validators.minLength(2)]],
			apellido: ['', [Validators.required, Validators.minLength(2)]],
			fecha_nacimiento: ['', Validators.required],
			genero: ['', Validators.required],
			nacionalidad: ['', Validators.required],
		});
	}

	private loadRouteData(): void {
		// Obtener el modo y DNI de los parámetros de ruta
		this.route.queryParams.subscribe((params) => {
			const mode = params['mode'] as FormMode;
			const dni = params['dni'];

			if (mode) {
				this.mode.set(mode);
			}

			if (dni) {
				this.personDni.set(dni);
				this.loadPersonData(dni);
			}

			// Si es modo view, deshabilitar todo el formulario
			if (this.mode() === 'view') {
				this.personForm.disable();
			}
		});
	}

	private loadPersonData(dni: string): void {
		this.loading.set(true);
		this.personService.getPersonByDNI(dni).subscribe({
			next: (persona) => {
				this.loading.set(false);
				this.personForm.patchValue({
					dni: persona.dni,
					nombre: persona.nombre,
					apellido: persona.apellido,
					fecha_nacimiento: persona.fecha_nacimiento,
					genero: persona.genero?.nombre || '',
					nacionalidad: persona.nacionalidad?.nombre || '',
				});
			},
			error: (error) => {
				this.loading.set(false);
				console.error('Error al cargar persona:', error);
			},
		});
	}

	onSubmit(): void {
		if (this.personForm.valid && this.mode() !== 'view') {
			this.loading.set(true);
			const formValue = this.personForm.getRawValue();

			const persona: Partial<Persona> = {
				dni: Number(formValue.dni),
				nombre: formValue.nombre,
				apellido: formValue.apellido,
				fecha_nacimiento: formValue.fecha_nacimiento,
				genero: { nombre: formValue.genero },
				nacionalidad: { nombre: formValue.nacionalidad },
			};

			console.log('Guardando persona:', persona);

			// Aquí llamarías al servicio correspondiente
			// if (this.mode() === 'create') {
			//   this.personService.createPerson(persona).subscribe(...)
			// } else {
			//   this.personService.updatePerson(persona).subscribe(...)
			// }

			// Simulación de guardado exitoso
			setTimeout(() => {
				this.loading.set(false);
				this.goBack();
			}, 1000);
		}
	}

	onCancel(): void {
		this.goBack();
	}

	goBack(): void {
		this.router.navigate(['/dashboard']);
	}

	// Getters para facilitar el acceso en el template
	get isCreateMode(): boolean {
		return this.mode() === 'create';
	}

	get isEditMode(): boolean {
		return this.mode() === 'edit';
	}

	get isViewMode(): boolean {
		return this.mode() === 'view';
	}

	get formTitle(): string {
		switch (this.mode()) {
			case 'create':
				return 'Agregar Nueva Persona';
			case 'edit':
				return 'Editar Persona';
			case 'view':
				return 'Detalle de Persona';
			default:
				return 'Persona';
		}
	}

	get submitButtonText(): string {
		return this.isCreateMode ? 'Crear Persona' : 'Guardar Cambios';
	}
}
