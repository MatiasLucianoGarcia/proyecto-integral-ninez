import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PersonService } from '../../services/person.service';
import { FamilyService } from '../../services/family.service';
import { Persona } from '../../domain/persona.model';
import { Parentezco, CreateFamilyMember } from '../../domain/familia.model';

export interface FamilyDialogData {
	mode: 'create' | 'edit';
	currentPersonDni: number;
	familyMember?: CreateFamilyMember;
}

@Component({
	selector: 'app-add-family-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
	],
	templateUrl: './add-family-dialog.component.html',
	styleUrl: './add-family-dialog.component.scss',
})
export class AddFamilyDialogComponent implements OnInit {
	private fb = inject(FormBuilder);
	private personService = inject(PersonService);
	private familyService = inject(FamilyService);

	familyForm!: FormGroup;
	parentezcoTypes = signal<Parentezco[]>([]);
	personSuggestions = signal<Persona[]>([]);
	loading = signal(false);
	searchingPerson = signal(false);
	selectedPerson = signal<Persona | null>(null);

	constructor(public dialogRef: MatDialogRef<AddFamilyDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: FamilyDialogData) {}

	ngOnInit(): void {
		this.loadParentezcoTypes();
		this.initForm();
		this.setupPersonSearch();
	}

	private initForm(): void {
		this.familyForm = this.fb.group({
			dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
			id_parentezco: ['', Validators.required],
			observaciones: [''],
		});

		// Si es modo edición, cargar los datos
		if (this.data.mode === 'edit' && this.data.familyMember) {
			this.familyForm.patchValue({
				dni: this.data.familyMember.dni_p2,
				id_parentezco: this.data.familyMember.id_parentezco1,
				observaciones: this.data.familyMember.observaciones,
			});
		}
	}

	private loadParentezcoTypes(): void {
		this.familyService.getParentezcoTypes().subscribe({
			next: (types) => {
				this.parentezcoTypes.set(types);
			},
			error: (error) => {
				console.error('Error al cargar tipos de parentezco:', error);
			},
		});
	}

	private setupPersonSearch(): void {
		this.familyForm
			.get('dni')
			?.valueChanges.pipe(
				debounceTime(500),
				distinctUntilChanged(),
				switchMap((dni) => {
					const dniString = dni ? dni.toString().trim() : '';

					// Limpiar estado si DNI es inválido
					if (!dniString || dniString.length < 7) {
						this.searchingPerson.set(false);
						this.selectedPerson.set(null);
						return of(null);
					}

					// Buscar persona
					this.searchingPerson.set(true);
					this.selectedPerson.set(null);
					return this.personService.getPersonByDNI(dniString);
				}),
			)
			.subscribe({
				next: (persona) => {
					this.searchingPerson.set(false);
					if (persona) {
						this.selectedPerson.set(persona);
					}
				},
				error: (error) => {
					this.searchingPerson.set(false);
					this.selectedPerson.set(null);
					console.log('Persona no encontrada o error:', error);
				},
			});
	}

	onSubmit(): void {
		if (this.familyForm.valid) {
			const formValue = this.familyForm.getRawValue();

			const familyMember: CreateFamilyMember = {
				dni_p1: this.data.currentPersonDni,
				dni_p2: Number(formValue.dni),
				id_parentezco1: formValue.id_parentezco,
				id_parentezco2: this.getInverseParentezco(formValue.id_parentezco), // Calcular relación inversa
				observaciones: formValue.observaciones || null,
			};

			this.dialogRef.close(familyMember);
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	// Mapeo de parentezcos inversos (esto debería venir del backend idealmente)
	private getInverseParentezco(parentezcoId: number): number {
		// Mapa de relaciones inversas (ajustar según tu base de datos)
		const inverseMap: { [key: number]: number } = {
			1: 3, // padre -> hijo
			2: 3, // madre -> hijo
			3: 1, // hijo -> padre (o madre, pero usamos padre por defecto)
			4: 4, // hermano -> hermano
			5: 5, // cónyuge -> cónyuge
			6: 7, // abuelo -> nieto
			7: 6, // nieto -> abuelo
			8: 9, // tío -> sobrino
			9: 8, // sobrino -> tío
		};

		return inverseMap[parentezcoId] || parentezcoId;
	}

	get isEditMode(): boolean {
		return this.data.mode === 'edit';
	}

	get dialogTitle(): string {
		return this.isEditMode ? 'Editar Familiar' : 'Agregar Familiar';
	}
}
