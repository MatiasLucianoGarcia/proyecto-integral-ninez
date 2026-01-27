import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PersonService } from '../../services/person.service';
import { FamilyService } from '../../services/family.service';
import { Persona } from '../../domain/persona.model';
import { Genero } from '../../domain/genero.model';
import { Nacionalidad } from '../../domain/nacionalidad.model';
import { FamilyMember } from '../../domain/familia.model';
import { FamilyTreeComponent } from '../family-tree/family-tree.component';
import { AddFamilyDialogComponent } from '../add-family-dialog/add-family-dialog.component';
import { SuggestedPersonCardComponent } from '../suggested-person-card/suggested-person-card.component';
import { DomicilioService } from '../../services/domicilio.service';
import { Domicilio } from '../../domain/domicilio.model';
import { AddressListComponent } from '../address-list/address-list.component';
import { AddAddressDialogComponent } from '../add-address-dialog/add-address-dialog.component';

import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserDataService } from '../../../../features/login/data/user-data.service';
import { RolEnum } from '../../../../features/login/domain/enums/role-enum';
import { Contact } from '../../domain/contact.model';
import { ContactService } from '../../services/contact.service';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { ContactListComponent } from '../contact-list/contact-list.component';


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
		MatTabsModule,
		MatSnackBarModule,
		FamilyTreeComponent,
		SuggestedPersonCardComponent,
		AddressListComponent,
		ContactListComponent,
	],
	templateUrl: './person-form.component.html',
	styleUrl: './person-form.component.scss',
})
export class PersonFormComponent implements OnInit {
	private fb = inject(FormBuilder);
	private personService = inject(PersonService);
	private familyService = inject(FamilyService);
	private domicilioService = inject(DomicilioService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private dialog = inject(MatDialog);
	private snackBar = inject(MatSnackBar);
	private userDataService = inject(UserDataService);

	personForm!: FormGroup;
	mode = signal<FormMode>('create');
	loading = signal(false);
	personData = signal<Persona | null>(null);
	personDni = signal<string | null>(null);
	familyMembers = signal<FamilyMember[]>([]);
	loadingFamily = signal(false);
	suggestedFamily = signal<Persona[]>([]);
	loadingSuggestedFamily = signal(false);
	domicilios = signal<Domicilio[]>([]);
	loadingDomicilios = signal(false);
	contacts = signal<Contact[]>([]);
	contactService = inject(ContactService);

	private loadContacts(dni: number): void {
		this.contactService.getContacts(dni).subscribe({
			next: (data) => {
				this.contacts.set(data);
			},
			error: (err) => {
				console.error('Error cargando contactos', err);
			},
		});
	}

	onAddContact(): void {
		if (!this.personDni()) return;
		const dni = Number(this.personDni());

		const dialogRef = this.dialog.open(AddContactDialogComponent, {
			width: '400px',
			data: { dni },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.loadContacts(dni);
				this.snackBar.open('Contacto agregado correctamente', 'Cerrar', {
					duration: 3000,
				});
			}
		});
	}

	onDeleteContact(id: number): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '350px',
			data: {
				title: 'Eliminar Contacto',
				message: '¿Está seguro que desea eliminar este contacto?',
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.contactService.deleteContact(id).subscribe({
					next: () => {
						const dni = Number(this.personDni());
						if (dni) {
							this.loadContacts(dni);
						}
						this.snackBar.open('Contacto eliminado correctamente', 'Cerrar', {
							duration: 3000,
						});
					},
					error: (error) => {
						console.error('Error al eliminar contacto:', error);
						this.snackBar.open('Error al eliminar contacto', 'Cerrar', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	// Opciones para los selects
	generos = signal<Genero[]>([]);
	nacionalidades = signal<Nacionalidad[]>([]);

	ngOnInit(): void {
		this.loadOptions();
		this.initForm();
		this.loadRouteData();
	}

	private loadOptions(): void {
		this.personService.getGeneros().subscribe({
			next: (data) => this.generos.set(data),
			error: (err) => console.error('Error cargando géneros', err)
		});

		this.personService.getNacionalidades().subscribe({
			next: (data) => this.nacionalidades.set(data),
			error: (err) => console.error('Error cargando nacionalidades', err)
		});
	}

	get canViewServicioLocal(): boolean {
		const user = this.userDataService.getUser();
		if (!user || !user.rol) return false;

		// Handle case where rol is an object (from backend) or a string (expected frontend model)
		let roleName = '';
		const rol: any = user.rol;

		if (typeof rol === 'string') {
			roleName = rol;
		} else if (typeof rol === 'object' && rol.nombre_rol) {
			roleName = rol.nombre_rol;
		}

		const normalizedRole = roleName.toLowerCase();
		return normalizedRole === 'administrador' || normalizedRole === 'proteccion';
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
				this.loadFamilyData(dni);
				this.loadSuggestedFamily(dni);
				this.loadDomicilios(dni);
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
				this.personData.set(persona);
				this.loadContacts(Number(persona.dni));
				// Patch form with IDs
				const generoId = persona.genero?.id;
				const nacionalidadId = persona.nacionalidad?.id;

				// Fix Date timezone issue by interpreting as local time
				let fechaNacimiento: any = persona.fecha_nacimiento;
				if (fechaNacimiento && typeof fechaNacimiento === 'string') {
					// Append T00:00:00 relative to local time if not present
					if (!fechaNacimiento.includes('T')) {
						fechaNacimiento = new Date(fechaNacimiento + 'T00:00:00');
					}
				}

				this.personForm.patchValue({
					dni: persona.dni,
					nombre: persona.nombre,
					apellido: persona.apellido,
					fecha_nacimiento: fechaNacimiento,
					genero: generoId,
					nacionalidad: nacionalidadId,
				});
			},
			error: (error) => {
				this.loading.set(false);
				console.error('Error al cargar persona:', error);
			},
		});
	}

	private loadFamilyData(dni: string): void {
		this.loadingFamily.set(true);
		this.familyService.getFamilyByDNI(Number(dni)).subscribe({
			next: (family) => {
				this.loadingFamily.set(false);
				this.familyMembers.set(family);
			},
			error: (error) => {
				this.loadingFamily.set(false);
				console.error('Error al cargar familia:', error);
				this.familyMembers.set([]);
			},
		});
	}

	// ... existing methods ...

	onSubmit(): void {
		if (this.personForm.valid && this.mode() !== 'view') {
			this.loading.set(true);
			const formValue = this.personForm.getRawValue();

			const persona: Partial<Persona> = {
				dni: Number(formValue.dni),
				nombre: formValue.nombre,
				apellido: formValue.apellido,
				fecha_nacimiento: formValue.fecha_nacimiento,
				id_genero: formValue.genero, // Send ID
				id_nacionalidad: formValue.nacionalidad, // Send ID
			};

			console.log('Guardando persona:', persona);

			if (this.mode() === 'create') {
				this.personService.createPerson(persona).subscribe({
					next: (newPerson) => {
						this.snackBar.open('Persona creada exitosamente', 'Cerrar', {
							duration: 3000,
						});
						this.loading.set(false);
						this.router.navigate(['/person-form'], {
							queryParams: { mode: 'view', id: newPerson.id },
						});
					},
					error: (err) => {
						console.error('Error al crear persona:', err);
						this.snackBar.open('Error al crear persona', 'Cerrar', {
							duration: 3000,
						});
						this.loading.set(false);
					}
				});
			} else {
				const currentPerson = this.personData();
				if (currentPerson && currentPerson.dni) {
					// Create a copy without DNI for update payload as it's not allowed in schema
					const { dni, ...personToUpdate } = persona;

					this.personService.updatePerson(currentPerson.dni, personToUpdate).subscribe({
						next: () => {
							this.snackBar.open('Persona actualizada exitosamente', 'Cerrar', {
								duration: 3000,
							});
							this.loading.set(false);
							this.router.navigate(['/person-form'], {
								queryParams: { mode: 'view', id: currentPerson.id },
							});
						},
						error: (err) => {
							console.error('Error al actualizar persona:', JSON.stringify(err));
							this.snackBar.open('Error al actualizar persona: ' + (err.error?.message || err.message), 'Cerrar', {
								duration: 5000,
							});
							this.loading.set(false);
						}
					});
				} else {
					console.error('No se puede actualizar: DNI de persona no encontrado');
					this.loading.set(false);
				}
			}
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

	onEditFamilyMember(member: FamilyMember): void {
		const dialogRef = this.dialog.open(AddFamilyDialogComponent, {
			width: '600px',
			data: {
				mode: 'edit',
				currentPersonDni: Number(this.personDni()),
				familyMember: {
					dni_p1: Number(this.personDni()),
					dni_p2: member.persona.dni,
					id_parentezco1: member.parentezco.id,
					id_parentezco2: member.parentezco.id,
					observaciones: member.observaciones,
				},
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.familyService.updateFamilyRelation(member.id, result).subscribe({
					next: () => {
						this.snackBar.open('Familiar actualizado exitosamente', 'Cerrar', {
							duration: 3000,
						});
						this.loadFamilyData(this.personDni()!);
					},
					error: (error) => {
						console.error('Error al actualizar familiar:', error);
						this.snackBar.open('Error al actualizar familiar', 'Cerrar', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	onAddFamilyMember(): void {
		const dialogRef = this.dialog.open(AddFamilyDialogComponent, {
			width: '600px',
			data: {
				mode: 'create',
				currentPersonDni: Number(this.personDni()),
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.familyService.createFamilyRelation(result).subscribe({
					next: () => {
						this.snackBar.open('Familiar agregado exitosamente', 'Cerrar', {
							duration: 3000,
						});
						this.loadFamilyData(this.personDni()!);
					},
					error: (error) => {
						console.error('Error al agregar familiar:', error);
						this.snackBar.open('Error al agregar familiar', 'Cerrar', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	onDeleteFamilyMember(member: FamilyMember): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Familiar',
				message: '¿Está seguro de eliminar la relación familiar con ' + member.persona.nombre + ' ' + member.persona.apellido + '?',
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.familyService.deleteFamilyRelation(member.id).subscribe({
					next: () => {
						this.snackBar.open('Familiar eliminado exitosamente', 'Cerrar', {
							duration: 3000,
						});
						this.loadFamilyData(this.personDni()!);
					},
					error: (error) => {
						console.error('Error al eliminar familiar:', error);
						this.snackBar.open('Error al eliminar familiar', 'Cerrar', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	onViewFamilyMember(member: FamilyMember): void {
		// Navegar al detalle de la persona familiar
		this.router.navigate(['/person-form'], {
			queryParams: { mode: 'view', dni: member.persona.dni },
		});
	}

	onViewSuggestedPerson(person: Persona): void {
		this.router.navigate(['/person-form'], {
			queryParams: {
				mode: 'view',
				dni: person.dni,
			},
		});
	}

	private loadSuggestedFamily(dni: string): void {
		this.loadingSuggestedFamily.set(true);
		this.familyService.suggestFamily(Number(dni)).subscribe({
			next: (suggestions) => {
				this.suggestedFamily.set(suggestions);
				this.loadingSuggestedFamily.set(false);
			},
			error: (error) => {
				console.error('Error al cargar sugerencias de familiares:', error);
				this.suggestedFamily.set([]);
				this.loadingSuggestedFamily.set(false);
			},
		});
	}

	addSuggestedFamily(suggestion: Persona): void {
		const dialogRef = this.dialog.open(AddFamilyDialogComponent, {
			width: '600px',
			data: {
				mode: 'create',
				currentPersonDni: Number(this.personDni()),
				prefilledDni: suggestion.dni,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.familyService.createFamilyRelation(result).subscribe(() => {
					this.loadFamilyData(this.personDni()!);
					this.loadSuggestedFamily(this.personDni()!);
				});
			}
		});
	}

	private loadDomicilios(dni: string): void {
		this.loadingDomicilios.set(true);
		this.domicilioService.getDomicilios(Number(dni)).subscribe({
			next: (domicilios) => {
				this.domicilios.set(domicilios);
				this.loadingDomicilios.set(false);
			},
			error: (error) => {
				console.error('Error al cargar domicilios:', error);
				this.domicilios.set([]);
				this.loadingDomicilios.set(false);
			},
		});
	}

	onAddDomicilio(): void {
		const dialogRef = this.dialog.open(AddAddressDialogComponent, {
			width: '500px',
			data: {
				dni: Number(this.personDni()),
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.domicilioService.crearDomicilio(result).subscribe({
					next: () => {
						this.snackBar.open('Domicilio agregado exitosamente', 'Cerrar', {
							duration: 3000,
						});
						this.loadDomicilios(this.personDni()!);
					},
					error: (error) => {
						console.error('Error al agregar domicilio:', error);
						this.snackBar.open('Error al agregar domicilio', 'Cerrar', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	onDeleteDomicilio(domicilio: Domicilio): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Domicilio',
				message: '¿Está seguro de eliminar el domicilio ' + domicilio.nombre + ' ' + domicilio.numero + '?',
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.domicilioService.eliminarDomicilio(domicilio.id).subscribe({
					next: () => {
						this.snackBar.open('Domicilio eliminado exitosamente', 'Cerrar', {
							duration: 3000,
						});
						this.loadDomicilios(this.personDni()!);
					},
					error: (error) => {
						console.error('Error al eliminar domicilio:', error);
						this.snackBar.open('Error al eliminar domicilio', 'Cerrar', {
							duration: 3000,
						});
					},
				});
			}
		});
	}
}
